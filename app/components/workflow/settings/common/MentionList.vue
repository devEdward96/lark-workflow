<script setup lang="ts">
import { ref, watch } from 'vue';

export interface MentionItem {
  id: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    items: MentionItem[];
    command: (item: MentionItem) => void;
    selectedIndex?: number;
  }>(),
  { selectedIndex: 0 },
);

const selectedIndex = ref(props.selectedIndex);

watch(
  () => props.selectedIndex,
  (v) => {
    selectedIndex.value = v;
  },
  { immediate: true },
);

watch(
  () => props.items,
  () => {
    selectedIndex.value = Math.min(
      Math.max(0, selectedIndex.value),
      Math.max(0, props.items.length - 1),
    );
  },
  { immediate: true },
);

function select(index: number) {
  const item = props.items[index];
  if (item) props.command(item);
}

function onKeyDown(e: KeyboardEvent): boolean {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex.value = Math.min(
      selectedIndex.value + 1,
      props.items.length - 1,
    );
    return true;
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
    return true;
  }
  if (e.key === 'Enter') {
    e.preventDefault();
    select(selectedIndex.value);
    return true;
  }
  return false;
}

defineExpose({
  selectedIndex,
  onKeyDown,
});
</script>

<template>
  <div
    class="mention-list"
    role="listbox"
    tabindex="-1"
    @keydown="onKeyDown"
  >
    <button
      v-for="(item, index) in items"
      :key="item.id"
      type="button"
      role="option"
      :aria-selected="index === selectedIndex"
      :class="{ 'mention-list__item--selected': index === selectedIndex }"
      class="mention-list__item"
      @click="select(index)"
      @mousedown.prevent
    >
      {{ item.label }}
    </button>
    <p v-if="items.length === 0" class="mention-list__empty">
      No variables
    </p>
  </div>
</template>

<style scoped>
.mention-list {
  max-height: 200px;
  overflow-y: auto;
  padding: 4px 0;
  background: var(--ui-bg, #fff);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--ui-border, #e5e7eb);
  outline: none;
}

.mention-list__item {
  display: block;
  width: 100%;
  padding: 6px 12px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: var(--ui-text, #111);
}

.mention-list__item:hover,
.mention-list__item--selected {
  background: var(--ui-bg-hover, #f3f4f6);
}

.mention-list__empty {
  margin: 0;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--ui-text-muted, #6b7280);
}
</style>
