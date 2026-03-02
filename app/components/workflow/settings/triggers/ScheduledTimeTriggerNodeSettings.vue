<script setup lang="ts">
import { watch, ref, nextTick } from 'vue';
import type { Node } from '@vue-flow/core';
import type { WorkflowNodeData } from '~/types/workflow';
import { useWorkflowEditorState } from '~/composables/workflow/useWorkflowEditorState';
import {
  ScheduleRecurrence,
  RECURRENCE_OPTIONS,
} from '~/config/nodeSettingTypes';

interface ScheduledTimeTriggerPayload {
  triggerDate: string;
  triggerTime: string;
  recurrence: ScheduleRecurrence | string;
}

function todayString(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

const props = defineProps<{
  node: Node<WorkflowNodeData> | undefined;
}>();

const { updateNodeData } = useWorkflowEditorState();
const isSyncingToStore = ref(false);
const payload = ref<ScheduledTimeTriggerPayload>(
  props.node?.data?.payload
    ? ({
        ...props.node.data.payload,
        triggerDate:
          (props.node.data.payload as ScheduledTimeTriggerPayload)
            .triggerDate ?? todayString(),
        triggerTime:
          (props.node.data.payload as ScheduledTimeTriggerPayload)
            .triggerTime ?? '09:30',
        recurrence:
          (props.node.data.payload as ScheduledTimeTriggerPayload).recurrence ??
          ScheduleRecurrence.Once,
      } as ScheduledTimeTriggerPayload)
    : {
        triggerDate: todayString(),
        triggerTime: '09:30',
        recurrence: ScheduleRecurrence.Once,
      },
);

function syncPayloadToStore() {
  if (!props.node?.data) return;
  const nodeId = props.node.id;
  isSyncingToStore.value = true;
  updateNodeData({
    nodeId,
    nodeData: {
      ...props.node.data,
      payload: payload.value,
    },
  });
  nextTick(() => {
    isSyncingToStore.value = false;
  });
}

watch(
  () => payload.value,
  () => {
    if (isSyncingToStore.value || !props.node?.data) return;
    syncPayloadToStore();
  },
  { deep: true },
);
</script>

<template>
  <template v-if="props.node && props.node.data">
    <a-form-item label="Set trigger time">
      <div class="trigger-time-row">
        <a-date-picker
          v-model:value="payload.triggerDate"
          class="trigger-time-field"
          format="MM/DD/YYYY"
          value-format="YYYY-MM-DD"
          placeholder="Select date"
          style="width: 120px"
          allow-clear
        />
        <a-time-picker
          v-model:value="payload.triggerTime"
          class="trigger-time-field"
          format="HH:mm"
          value-format="HH:mm"
          :minute-step="30"
          placeholder="00:00"
          style="width: 80px"
          allow-clear
        />
        <a-select
          v-model:value="payload.recurrence"
          class="trigger-time-field"
          placeholder="Recurrence"
          style="min-width: 160px; flex: 1"
        >
          <a-select-option
            v-for="opt in RECURRENCE_OPTIONS"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
          </a-select-option>
        </a-select>
      </div>
    </a-form-item>
  </template>
</template>

<style scoped>
.trigger-time-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.trigger-time-field {
  flex-shrink: 0;
}
</style>
