<script setup lang="ts">
import { computed } from 'vue';
import {
  CalendarOutlined,
  FileTextOutlined,
  LinkOutlined,
  NumberOutlined,
  PhoneOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';

export interface TableColumnOption {
  id: number;
  name: string;
  type: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: number | null;
    columns: TableColumnOption[];
    title?: string;
    infoMessage?: string;
  }>(),
  {
    title: 'And the selected field is not empty',
    infoMessage:
      "When this field is empty, any changes to the record will not trigger 'Record changes'.",
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void;
}>();

const typeToIcon = computed(() => ({
  string: FileTextOutlined,
  number: NumberOutlined,
  date: CalendarOutlined,
  phone: PhoneOutlined,
  user: UserOutlined,
  lookup: LinkOutlined,
  formula: NumberOutlined,
  select: UnorderedListOutlined,
  default: FileTextOutlined,
}));

function iconForColumn(column: TableColumnOption) {
  const type = (column.type || 'string').toLowerCase();
  return (
    typeToIcon.value[type as keyof typeof typeToIcon.value] ??
    typeToIcon.value.default
  );
}
</script>

<template>
  <div class="table-columns-radio">
    <a-typography-text v-if="title" class="radio-title">
      {{ title }}
    </a-typography-text>

    <a-radio-group
      :value="modelValue"
      class="radio-group"
      @update:value="(v: number) => emit('update:modelValue', v)"
    >
      <div v-for="column in columns" :key="column.id">
        <div
          class="column-row"
          :class="{ 'column-row--selected': modelValue === column.id }"
        >
          <a-radio :value="column.id" class="column-radio">
            <span class="column-content">
              <component :is="iconForColumn(column)" class="column-icon" />
              <span class="column-name">{{ column.name }}</span>
            </span>
          </a-radio>
        </div>
        <a-alert
          v-if="infoMessage && modelValue === column.id"
          type="info"
          show-icon
          class="info-alert"
        >
          <template #message>
            {{ infoMessage }}
          </template>
        </a-alert>
      </div>
    </a-radio-group>
  </div>
</template>

<style scoped>
.table-columns-radio {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-title {
  display: block;
  margin-bottom: 4px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.radio-group :deep(.ant-radio-wrapper) {
  margin-inline-end: 0;
  align-items: center;
}

.column-row {
  padding: 8px 12px;
  border-radius: 8px;
  background-color: #fafafa;
  border: 1px solid transparent;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.column-row:hover {
  background-color: #f5f5f5;
}

.column-row--selected {
  background-color: #f5f5f5;
}

.column-radio {
  width: 100%;
}

.column-content {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.column-icon {
  font-size: 16px;
  color: #8c8c8c;
}

.column-row--selected .column-icon {
  color: #1677ff;
}

.column-name {
  font-size: 14px;
}

.info-alert {
  margin-top: 8px;
  margin-bottom: 8px;
}
</style>
