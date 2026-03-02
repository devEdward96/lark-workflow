<script setup lang="ts">
import { computed } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import {
  CalendarOutlined,
  CloseOutlined,
  FileTextOutlined,
  LinkOutlined,
  NumberOutlined,
  PhoneOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons-vue';
import {
  BUTTON_CONDITION_OPERATOR_OPTIONS,
  ButtonConditionOperator,
} from '~/types/conditionOperators';

export interface TableColumnOption {
  id: number;
  name: string;
  type: string;
}

export interface ColumnTriggerConfig {
  operator: string;
  value: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: number[];
    columns: TableColumnOption[];
    triggerConfigByColumnId?: Record<number, ColumnTriggerConfig>;
    title?: string;
    infoMessage?: string;
    triggerConfigLabel?: string;
  }>(),
  {
    title: 'Select columns',
    infoMessage: '',
    triggerConfigByColumnId: () => ({}),
    triggerConfigLabel: 'Changes to',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void;
  (
    e: 'update:triggerConfigByColumnId',
    value: Record<number, ColumnTriggerConfig>,
  ): void;
}>();

const triggerConfig = computed({
  get: () => props.triggerConfigByColumnId ?? {},
  set: (v) => emit('update:triggerConfigByColumnId', v),
});

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

function isChecked(columnId: number) {
  return props.modelValue.includes(columnId);
}

function onCheckedChange(columnId: number, checked: boolean) {
  const next = checked
    ? [...props.modelValue, columnId]
    : props.modelValue.filter((id) => id !== columnId);
  emit('update:modelValue', next);
  if (!checked) {
    clearTrigger(columnId);
  }
}

function selectAll() {
  emit(
    'update:modelValue',
    props.columns.map((c) => c.id),
  );
}

function unselectAll() {
  emit('update:modelValue', []);
  emit('update:triggerConfigByColumnId', {});
}

function getColumnTrigger(columnId: number): ColumnTriggerConfig | undefined {
  return triggerConfig.value[columnId];
}

function hasTrigger(columnId: number) {
  return columnId in (triggerConfig.value ?? {});
}

function openSetTrigger(columnId: number) {
  const next = { ...(triggerConfig.value ?? {}) };
  next[columnId] = { operator: ButtonConditionOperator.Is, value: '' };
  if (!props.modelValue.includes(columnId)) {
    emit('update:modelValue', [...props.modelValue, columnId]);
  }
  emit('update:triggerConfigByColumnId', next);
}

function clearTrigger(columnId: number) {
  const next = { ...(triggerConfig.value ?? {}) };
  delete next[columnId];
  emit('update:triggerConfigByColumnId', next);
}

function updateTriggerOperator(columnId: number, operator: string) {
  const current = triggerConfig.value[columnId];
  if (!current) return;
  const next = { ...(triggerConfig.value ?? {}) };
  next[columnId] = { ...current, operator };
  emit('update:triggerConfigByColumnId', next);
}

function updateTriggerValue(columnId: number, value: string) {
  const current = triggerConfig.value[columnId];
  if (!current) return;
  const next = { ...(triggerConfig.value ?? {}) };
  next[columnId] = { ...current, value };
  emit('update:triggerConfigByColumnId', next);
}
</script>

<template>
  <div class="table-columns-checkbox">
    <div v-if="title" class="checkbox-header">
      <a-typography-text class="checkbox-title">
        {{ title }}
      </a-typography-text>
      <a-space size="small">
        <a-button type="link" size="small" @click="selectAll">
          Select all
        </a-button>
        <a-button type="link" size="small" @click="unselectAll">
          Unselect
        </a-button>
      </a-space>
    </div>

    <div class="checkbox-list">
      <div v-for="column in columns" :key="column.id" class="column-entry">
        <div
          class="column-row"
          :class="{ 'column-row--selected': isChecked(column.id) }"
        >
          <a-checkbox
            :checked="isChecked(column.id)"
            class="column-checkbox"
            @update:checked="
              (checked: boolean) => onCheckedChange(column.id, checked)
            "
          >
            <span class="column-content">
              <component :is="iconForColumn(column)" class="column-icon" />
              <span class="column-name">{{ column.name }}</span>
            </span>
          </a-checkbox>
          <a-button
            v-show="!hasTrigger(column.id)"
            type="link"
            size="small"
            class="set-trigger-btn"
            @click.stop="openSetTrigger(column.id)"
          >
            <PlusOutlined />
            Set trigger
          </a-button>
          <a-divider v-if="hasTrigger(column.id)" style="margin: 12px 0" />
          <div v-if="hasTrigger(column.id)" class="trigger-config">
            <span class="trigger-config-label">{{ triggerConfigLabel }}</span>
            <a-select
              :value="getColumnTrigger(column.id)?.operator"
              class="trigger-operator-select"
              @update:value="(v: string) => updateTriggerOperator(column.id, v)"
            >
              <a-select-option
                v-for="opt in BUTTON_CONDITION_OPERATOR_OPTIONS"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </a-select-option>
            </a-select>
            <a-input
              :value="getColumnTrigger(column.id)?.value"
              class="trigger-value-input"
              placeholder="Enter here"
              allow-clear
              @update:value="(v: string) => updateTriggerValue(column.id, v)"
            />
            <a-button
              type="text"
              size="small"
              class="trigger-clear-btn"
              @click="clearTrigger(column.id)"
            >
              <CloseOutlined />
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <a-alert
      v-if="infoMessage && modelValue.length > 0"
      type="info"
      show-icon
      class="info-alert"
    >
      <template #message>
        {{ infoMessage }}
      </template>
    </a-alert>
  </div>
</template>

<style scoped>
.table-columns-checkbox {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.checkbox-list :deep(.ant-checkbox-wrapper) {
  margin-inline-end: 0;
  align-items: center;
}

.column-entry {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.column-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 0;
  padding: 12px;
  border-radius: 8px;
  background-color: #fafafa;
  border: 1px solid transparent;
  position: relative;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.column-row:hover {
  background-color: #f5f5f5;
}

.set-trigger-btn {
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s;
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
}

.column-row:hover .set-trigger-btn {
  opacity: 1;
}

.trigger-config {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
  border-radius: 8px;
  background-color: transparent;
}

.trigger-config-label {
  font-size: 13px;
  color: #8c8c8c;
  flex-shrink: 0;
}

.trigger-operator-select {
  width: 140px;
}

.trigger-value-input {
  flex: 1;
  min-width: 0;
}

.trigger-clear-btn {
  flex-shrink: 0;
  color: #8c8c8c;
}

.trigger-clear-btn:hover {
  color: #ff4d4f;
}

.column-row--selected {
}

.column-checkbox {
  flex: 1;
  min-width: 0;
}

.column-row :deep(.ant-checkbox-wrapper) {
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
