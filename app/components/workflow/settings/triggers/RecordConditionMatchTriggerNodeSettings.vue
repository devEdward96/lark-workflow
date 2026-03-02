<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue';
import type { Node } from '@vue-flow/core';
import type { WorkflowNodeData } from '~/types/workflow';
import { nanoid } from 'nanoid';
import { useWorkflowEditorState } from '~/composables/workflow/useWorkflowEditorState';
import {
  ButtonConditionOperator,
  BUTTON_CONDITION_OPERATOR_OPTIONS,
} from '~/types/conditionOperators';
import AndOrConditionBuilder, {
  type ConditionGroupOption,
} from '~/components/workflow/settings/common/AndOrConditionBuilder.vue';
import TableSelect from '~/components/workflow/settings/common/TableSelect.vue';
import TriggerLimitSettings from '~/components/workflow/settings/common/TriggerLimitSettings.vue';

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

interface RecordConditionMatchTriggerPayload {
  tableId: number | null;
  groups: ButtonConditionGroup[];
  columns: number[];
  triggerLimitKeys: string[];
}

const props = defineProps<{
  node: Node<WorkflowNodeData> | undefined;
}>();

const { tables, updateNodeData } = useWorkflowEditorState();
const isSyncingToStore = ref(false);
const defaultTriggerLimitKeys = [
  'bulk_copy_paste',
  'bulk_update_workflow',
  'bulk_update_open_api',
];

const payload = ref<RecordConditionMatchTriggerPayload>(
  props.node?.data?.payload
    ? {
        ...(props.node.data.payload as RecordConditionMatchTriggerPayload),
        triggerLimitKeys: (
          props.node.data.payload as RecordConditionMatchTriggerPayload
        ).triggerLimitKeys ?? [...defaultTriggerLimitKeys],
      }
    : {
        tableId: null,
        groups: [createEmptyGroup()],
        columns: [],
        triggerLimitKeys: [...defaultTriggerLimitKeys],
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

const selectedTable = computed(() =>
  tables.value.find((table) => table.id === payload.value.tableId),
);

const selectedTableColumns = computed(() => selectedTable.value?.columns ?? []);

function onGroupsUpdate(groups: ConditionGroupOption[]) {
  payload.value.groups = groups as ButtonConditionGroup[];
}

function createEmptyFilterCondition(): ButtonCondition {
  return {
    id: nanoid(),
    fieldName: null,
    operator: ButtonConditionOperator.Is,
    value: '',
  };
}
function createEmptyFilterGroup(): ButtonConditionGroup {
  return {
    id: nanoid(),
    conditions: [createEmptyFilterCondition()],
  };
}
</script>

<template>
  <template v-if="props.node && props.node.data">
    <TableSelect
      v-model:model-value="payload.tableId"
      :tables="tables"
      label="Select table"
      placeholder="Select table"
    />
    <AndOrConditionBuilder
      v-if="payload.tableId !== null"
      :model-value="payload.groups"
      :table-columns="selectedTableColumns"
      :operator-options="BUTTON_CONDITION_OPERATOR_OPTIONS"
      :create-empty-condition="createEmptyCondition"
      :create-empty-group="createEmptyGroup"
      empty-label="Add condition group"
      conditions-title="Set conditions"
      :min-groups="1"
      @update:model-value="onGroupsUpdate"
    />
    <TriggerLimitSettings v-model:model-value="payload.triggerLimitKeys" />
  </template>
</template>

<style scoped>
.trigger-summary {
  margin-bottom: 12px;
  background-color: #fafafa;
}
.filter-records-title {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  width: 100%;
}
.filter-records-option {
  display: flex;
  gap: 4px;
  align-items: center;
}
.filter-records-title-text {
  display: flex;
  align-items: center;
  gap: 4px;
}
</style>
