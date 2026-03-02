<script setup lang="ts">
import { ref } from 'vue';
import {
  CaretDownOutlined,
  CaretUpOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons-vue';

export interface TriggerLimitOption {
  key: string;
  label: string;
  tooltip?: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: string[];
    options?: TriggerLimitOption[];
    introText?: string;
    defaultExpanded?: boolean;
  }>(),
  {
    introText:
      "The following scenarios won't trigger automations or workflows:",
    defaultExpanded: true,
    options: () => [
      {
        key: 'bulk_copy_paste',
        label: 'Copying or pasting data in bulk',
        tooltip: 'Bulk copy or paste operations will not trigger automations.',
      },
      {
        key: 'bulk_update_workflow',
        label: 'Updating data in bulk via workflow',
        tooltip:
          'Updates made by another workflow in bulk will not trigger automations.',
      },
      {
        key: 'sync_scheduled',
        label: 'Syncing scheduled data from other sources',
      },
      {
        key: 'bulk_update_open_api',
        label: 'Updating data in bulk via Open API',
      },
    ],
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void;
}>();

const expanded = ref(props.defaultExpanded);

function isChecked(key: string) {
  return props.modelValue.includes(key);
}

function onCheckedChange(key: string, checked: boolean) {
  const next = checked
    ? [...props.modelValue, key]
    : props.modelValue.filter((k) => k !== key);
  emit('update:modelValue', next);
}
</script>

<template>
  <div class="trigger-limit-settings">
    <button
      type="button"
      class="trigger-limit-header"
      @click="expanded = !expanded"
    >
      <span class="trigger-limit-header-text">Trigger limit settings</span>
      <CaretUpOutlined v-if="expanded" class="trigger-limit-caret" />
      <CaretDownOutlined v-else class="trigger-limit-caret" />
    </button>

    <div v-show="expanded" class="trigger-limit-body">
      <p class="trigger-limit-intro">
        {{ introText }}
      </p>

      <div class="trigger-limit-list">
        <div
          v-for="option in options"
          :key="option.key"
          class="trigger-limit-item"
        >
          <a-checkbox
            :checked="isChecked(option.key)"
            @update:checked="(c: boolean) => onCheckedChange(option.key, c)"
          >
            <span class="trigger-limit-label">{{ option.label }}</span>
          </a-checkbox>
          <a-tooltip v-if="option.tooltip">
            <template #title>{{ option.tooltip }}</template>
            <InfoCircleOutlined class="trigger-limit-info-icon" />
          </a-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trigger-limit-settings {
  border-radius: 8px;
  overflow: hidden;
  margin-top: 12px;
}

.trigger-limit-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0;
  background-color: transparent;
  border: none;
  gap: 4px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.7);
  transition: background-color 0.2s;
}

.trigger-limit-header:hover {
  background-color: transparent;
}

.trigger-limit-header-text {
  text-align: left;
}

.trigger-limit-caret {
  font-size: 12px;
  color: #8c8c8c;
}

.trigger-limit-body {
  padding: 12px 0 0;
}

.trigger-limit-intro {
  margin: 0 0 12px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.88);
  line-height: 1.5;
}

.trigger-limit-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.trigger-limit-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.trigger-limit-item .ant-checkbox-wrapper {
  margin-inline-end: 0;
}

.trigger-limit-label {
  font-size: 14px;
}

.trigger-limit-info-icon {
  font-size: 14px;
  color: #8c8c8c;
  flex-shrink: 0;
}

.trigger-limit-info-icon:hover {
  color: #1677ff;
}
</style>
