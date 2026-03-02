<script setup lang="ts">
import { watch } from 'vue';
import { useEditor, EditorContent, VueNodeViewRenderer } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import { PlusOutlined } from '@ant-design/icons-vue';
import MentionNodeView from './MentionNodeView.vue';

export interface VariableOption {
  id: string | number;
  label: string;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    variables?: VariableOption[];
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: '',
    variables: () => [],
    placeholder: 'Type @ to insert a variable…',
    disabled: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

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

function addVariable() {
  editor.value
    ?.chain()
    .focus()
    .insertContent([
      {
        type: 'mention',
        attrs: { id: '1', label: 'Hello', mentionSuggestionChar: '' },
      },
    ])
    .run();
}
</script>

<template>
  <div class="input-value-with-variables">
    <EditorContent
      :editor="editor"
      class="input-value-with-variables__content"
    />
    <a-button type="text" size="small" @click="addVariable">
      <template #icon>
        <PlusOutlined />
      </template>
      Add variable
    </a-button>
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

</style>
