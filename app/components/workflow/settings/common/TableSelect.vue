<script setup lang="ts">
export interface TableOption {
  id: number;
  name: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: number | null;
    tables: TableOption[];
    label?: string;
    placeholder?: string;
    class?: string;
  }>(),
  {
    label: 'Table with button field',
    placeholder: 'Select table',
    class: '',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();
</script>

<template>
  <a-form-item :label="label" :class="class">
    <a-select
      :value="modelValue"
      :placeholder="placeholder"
      style="width: 100%"
      allow-clear
      @update:value="emit('update:modelValue', $event ?? null)"
    >
      <a-select-option
        v-for="table in tables"
        :key="table.id"
        :value="table.id"
      >
        {{ table.name }}
      </a-select-option>
    </a-select>
  </a-form-item>
</template>
