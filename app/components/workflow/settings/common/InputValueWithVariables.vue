<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { useEditor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import {
  PlusOutlined,
  DownOutlined,
  FolderOutlined,
  FileOutlined,
} from '@ant-design/icons-vue';
import MentionNodeView from './MentionNodeView.vue';
import sampleVariables from '~/data/sampleVariablesTree';

export interface VariableOption {
  id: string | number;
  label: string;
}

interface VariableTreeNode {
  title: string;
  key: string | number;
  children?: VariableTreeNode[];
  isLeaf?: boolean;
  selectable?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: '',
    placeholder: '',
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const variableDropdownOpen = ref(false);
const variableSearch = ref('');

const variableTreeData = computed<VariableTreeNode[]>(() => {
  const vars = sampleVariables;

  if (!vars.length) {
    return [];
  }

  return vars;
});

function filterTree(
  nodes: VariableTreeNode[],
  query: string,
): VariableTreeNode[] {
  const q = query.toLowerCase();
  const result: VariableTreeNode[] = [];

  nodes.forEach((node) => {
    const titleMatch = node.title.toLowerCase().includes(q);
    const children = node.children
      ? filterTree(node.children, query)
      : undefined;

    if (!titleMatch && (!children || !children.length)) {
      return;
    }

    result.push({
      ...node,
      ...(children && children.length ? { children } : {}),
    });
  });

  return result;
}

const filteredVariableTreeData = computed<VariableTreeNode[]>(() => {
  const tree = variableTreeData.value;
  const query = variableSearch.value.trim();

  if (!query) {
    return tree;
  }

  return filterTree(tree, query);
});

const editor = useEditor({
  content: props.modelValue || '',
  editable: !props.disabled,
  extensions: [
    StarterKit.configure({
      blockquote: false,
      bulletList: false,
      codeBlock: false,
      hardBreak: false,
      heading: false,
      horizontalRule: false,
      listItem: false,
      orderedList: false,
    }),
    Mention.extend({
      addNodeView() {
        return VueNodeViewRenderer(MentionNodeView);
      },
    }).configure({
      HTMLAttributes: {
        class: 'input-value-mention',
      },
      suggestion: {
        char: '',
      },
    }),
  ],
  editorProps: {
    attributes: {
      class: 'input-value-with-variables__editor',
      'data-placeholder': props.placeholder,
    },
    handleDOMEvents: {
      paste: (view, event) => {
        const text = event.clipboardData?.getData('text/plain');
        if (text) {
          event.preventDefault();
          const { state } = view;
          const { from, to } = state.selection;
          view.dispatch(state.tr.insertText(text, from, to));
          return true;
        }
        return false;
      },
    },
  },
  onUpdate: ({ editor: e }) => {
    const html = e.getHTML();
    emit('update:modelValue', html === '<p></p>' ? '' : html);
  },
});

// Sync external modelValue into editor
watch(
  () => props.modelValue,
  (val) => {
    const current = editor.value?.getHTML() ?? '';
    const next = val || '<p></p>';
    if (current !== next)
      editor.value?.commands.setContent(next, { emitUpdate: false });
  },
  { immediate: true },
);

watch(
  () => props.disabled,
  (disabled) => {
    editor.value?.setEditable(!disabled);
  },
  { immediate: true },
);

function insertVariableMention(variable: VariableOption) {
  editor.value
    ?.chain()
    .focus()
    .insertContent([
      {
        type: 'mention',
        attrs: {
          id: String(variable.id),
          label: variable.label,
          mentionSuggestionChar: '',
        },
      },
    ])
    .run();
}

function handleVariableSelect(_keys: (string | number)[], info: { node: any }) {
  const node = info?.node;

  if (!node || node.selectable === false || (!node.isLeaf && node.children)) {
    return;
  }

  insertVariableMention({
    id: node.key,
    label: node.title,
  });

  variableDropdownOpen.value = false;
}
</script>

<template>
  <div class="input-value-with-variables">
    <EditorContent
      :editor="editor"
      class="input-value-with-variables__content"
    />
    <a-dropdown
      v-model:open="variableDropdownOpen"
      trigger="['click']"
      placement="bottomLeft"
    >
      <a-button type="text" size="small">
        <template #icon>
          <PlusOutlined />
        </template>
      </a-button>
      <template #overlay>
        <div class="input-value-with-variables__dropdown">
          <a-input
            v-model:value="variableSearch"
            allow-clear
            class="input-value-with-variables__dropdown-search"
            placeholder="Search values or select the following options"
          />
          <div class="input-value-with-variables__dropdown-content">
            <div
              class="input-value-with-variables__dropdown-formula-calculation-container"
            >
              <a-typography-text
                class="input-value-with-variables__dropdown-formula-calculation"
                >Formula Calculation</a-typography-text
              >
              <a-button
                type="link"
                class="input-value-with-variables__dropdown-formula-calculation-add-button"
              >
                <template #icon>
                  <PlusOutlined />
                </template>
                Add Formula
              </a-button>
            </div>
            <div
              class="input-value-with-variables__dropdown-reference-value-container"
            >
              <a-typography-text
                class="input-value-with-variables__dropdown-formula-calculation"
                >Reference value</a-typography-text
              >
              <a-tree
                v-if="filteredVariableTreeData.length"
                :tree-data="filteredVariableTreeData"
                :default-expand-all="false"
                :block-node="true"
                :selectable="true"
                :show-icon="true"
                @select="handleVariableSelect"
              >
                <template #switcherIcon="{ switcherCls }">
                  <DownOutlined :class="switcherCls" />
                </template>
                <template #icon="{ data }">
                  <component :is="data.itemIcon" v-if="data.itemIcon" />
                  <FolderOutlined v-else />
                </template>
              </a-tree>
              <div v-else class="input-value-with-variables__dropdown-empty">
                No variables available
              </div>
            </div>
          </div>
        </div>
      </template>
    </a-dropdown>
  </div>
</template>

<style scoped>
.input-value-with-variables {
  border: 1px solid var(--ui-border, #d9d9d9);
  border-radius: 6px;
  background: var(--ui-bg, #fff);
  min-height: 32px;
}

.input-value-with-variables__content
  :deep(.input-value-with-variables__editor) {
  min-height: 32px;
  padding: 4px 11px;
  outline: none;
}

.input-value-with-variables__content
  :deep(.input-value-with-variables__editor:empty::before) {
  content: attr(data-placeholder);
  color: var(--ui-text-muted, #bfbfbf);
}

.input-value-with-variables__dropdown {
  max-height: 320px;
  overflow: auto;
  padding: 8px 0 12px;
  width: 425px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.input-value-with-variables__dropdown-search {
  width: calc(100% - 16px);
  position: absolute;
  top: 8px;
  left: 8px;
}

.input-value-with-variables__dropdown-empty {
  padding: 8px 12px;
  color: var(--ui-text-muted, #bfbfbf);
  font-size: 13px;
}

.input-value-with-variables__dropdown-formula-calculation-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 8px 12px;
}

.input-value-with-variables__dropdown-formula-calculation {
  margin: 8px 0;
  font-size: 13px;
  color: var(--ui-text-muted, #bfbfbf);
}

.input-value-with-variables__dropdown-reference-value-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 8px 12px;
}

.input-value-with-variables__dropdown-formula-calculation-add-button {
  padding: 0;
  margin: 0;
}

.input-value-with-variables__dropdown-content {
  padding-top: 32px;
}
:deep(.ant-tree .ant-tree-switcher) {
  text-align: left;
  width: 8px;
}
</style>
