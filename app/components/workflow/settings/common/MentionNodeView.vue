<script setup lang="ts">
import { computed } from 'vue';
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3';

const props = defineProps(nodeViewProps);

const label = computed(() => props.node.attrs.label ?? props.node.attrs.id ?? '');

function remove(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  props.deleteNode();
}
</script>

<template>
  <NodeViewWrapper as="span" class="mention-node-view">
    <span class="mention-node-view__label">{{ label }}</span>
    <button
      type="button"
      class="mention-node-view__remove"
      aria-label="Remove"
      @mousedown.prevent="remove"
    >
      ×
    </button>
  </NodeViewWrapper>
</template>

<style scoped>
.mention-node-view {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  background: var(--ui-bg-muted, #f0f0f0);
  border-radius: 4px;
  padding: 0 4px 0 6px;
  font-weight: 500;
  white-space: nowrap;
}

.mention-node-view__label {
  font-size: inherit;
}

.mention-node-view__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  background: transparent;
  border-radius: 2px;
  font-size: 14px;
  line-height: 1;
  color: var(--ui-text-muted, #8c8c8c);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}

.mention-node-view__remove:hover {
  color: var(--ui-text, #262626);
  background: rgba(0, 0, 0, 0.06);
}
</style>
