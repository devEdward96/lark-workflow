<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue';
import type { Node } from '@vue-flow/core';
import type { WorkflowNodeData } from '~/types/workflow';
import { nanoid } from 'nanoid';
import { CalendarOutlined } from '@ant-design/icons-vue';
import { useWorkflowEditorState } from '~/composables/workflow/useWorkflowEditorState';
import {
  ButtonConditionOperator,
  BUTTON_CONDITION_OPERATOR_OPTIONS,
} from '~/types/conditionOperators';
import AndOrConditionBuilder, {
  type ConditionGroupOption,
} from '~/components/workflow/settings/common/AndOrConditionBuilder.vue';
import TableSelect from '~/components/workflow/settings/common/TableSelect.vue';
import {
  TRIGGER_OFFSET_OPTIONS,
  TriggerOffset,
} from '~/config/nodeSettingTypes';

interface ButtonCondition {
  id: string;
  fieldName: string | null;
  operator: ButtonConditionOperator;
  value: string;
}

interface ButtonConditionGroup {
  id: string;
  conditions: ButtonCondition[];
}

interface ScheduledTimeTriggerPayload {
  tableId: number | null;
  dateFieldId: number | null;
  triggerOffset: TriggerOffset | string;
  triggerTime: string;
  groups: ButtonConditionGroup[];
}

const props = defineProps<{
  node: Node<WorkflowNodeData> | undefined;
}>();

const { tables, updateNodeData } = useWorkflowEditorState();
const isSyncingToStore = ref(false);
const payload = ref<ScheduledTimeTriggerPayload>(
  props.node?.data?.payload
    ? ({
        ...props.node.data.payload,
        triggerOffset:
          (props.node.data.payload as ScheduledTimeTriggerPayload)
            .triggerOffset ?? TriggerOffset.OneDayAfter,
        triggerTime:
          (props.node.data.payload as ScheduledTimeTriggerPayload)
            .triggerTime ?? '09:30',
      } as ScheduledTimeTriggerPayload)
    : {
        tableId: null,
        dateFieldId: null,
        triggerOffset: TriggerOffset.OneDayAfter,
        triggerTime: '09:30',
        groups: [],
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

const selectedTable = computed(() =>
  tables.value.find((table) => table.id === payload.value.tableId),
);

const selectedTableColumns = computed(() => selectedTable.value?.columns ?? []);

const dateFieldColumns = computed(() =>
  selectedTableColumns.value.filter(
    (col) => (col.type || '').toLowerCase() === 'date',
  ),
);

function createEmptyCondition(): ButtonCondition {
  return {
    id: nanoid(),
    fieldName: null,
    operator: ButtonConditionOperator.Is,
    value: '',
  };
}

function createEmptyGroup(): ButtonConditionGroup {
  return {
    id: nanoid(),
    conditions: [createEmptyCondition()],
  };
}

function onGroupsUpdate(groups: ConditionGroupOption[]) {
  payload.value.groups = groups as ButtonConditionGroup[];
}

function addConcurrentCondition() {
  if (payload.value.groups.length === 0) {
    payload.value.groups = [createEmptyGroup()];
  } else {
    payload.value.groups = [...payload.value.groups, createEmptyGroup()];
  }
}

watch(
  () => payload.value.tableId,
  () => {
    payload.value.dateFieldId = null;
  },
);
</script>

<template>
  <template v-if="props.node && props.node.data">
    <div class="table-and-date-field-select">
      <TableSelect
        v-model:model-value="payload.tableId"
        :tables="tables"
        class="table-and-date-field-select-item"
        label="Select table"
        placeholder="Select table"
      />

      <a-form-item
        label="Select date field"
        class="table-and-date-field-select-item"
        style="width: 100%"
      >
        <a-select
          v-model:value="payload.dateFieldId"
          placeholder="Select date field"
          allow-clear
        >
          <a-select-option
            v-for="col in dateFieldColumns"
            :key="col.id"
            :value="col.id"
          >
            <CalendarOutlined style="margin-right: 8px" />
            {{ col.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </div>

    <a-form-item label="Set trigger time">
      <div class="trigger-time-select">
        <a-select
          v-model:value="payload.triggerOffset"
          class="trigger-time-select-item"
          placeholder="Relative time"
        >
          <a-select-option
            v-for="opt in TRIGGER_OFFSET_OPTIONS"
            :key="opt.value"
            :value="opt.value"
          >
            {{ opt.label }}
            <span v-if="payload.triggerTime" class="offset-time-suffix">
              ({{ payload.triggerTime }})
            </span>
          </a-select-option>
        </a-select>
        <a-time-picker
          v-model:value="payload.triggerTime"
          class="trigger-time-select-item"
          format="HH:mm"
          value-format="HH:mm"
          :minute-step="5"
          :showNow="false"
          placeholder="09:30"
          style="width: 100px"
          allow-clear
        />
      </div>
    </a-form-item>
    <a-divider />
    <AndOrConditionBuilder
      :model-value="payload.groups"
      :table-columns="selectedTableColumns"
      :operator-options="BUTTON_CONDITION_OPERATOR_OPTIONS"
      :create-empty-condition="createEmptyCondition"
      :create-empty-group="createEmptyGroup"
      empty-label="Add concurrent condition"
      conditions-title="When trigger time meets the following condition"
      @update:model-value="onGroupsUpdate"
    />
  </template>
</template>

<style scoped>
.table-and-date-field-select {
  display: flex;
  gap: 12px;
  align-items: center;
}

.table-and-date-field-select-item {
  flex: 1;
}

.trigger-time-select {
  display: flex;
  gap: 12px;
  align-items: center;
}

.trigger-time-select-item {
  width: 100%;
}

.offset-time-suffix {
  margin-left: 4px;
  color: #8c8c8c;
}
</style>
