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
import TableColumnsRadio from '~/components/workflow/settings/common/TableColumnsRadio.vue';

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

interface ButtonClickedTriggerPayload {
  tableId: number | null;
  groups: ButtonConditionGroup[];
  notEmptyColumnId: number | null;
}

const props = defineProps<{
  node: Node<WorkflowNodeData> | undefined;
}>();

const { tables, updateNodeData } = useWorkflowEditorState();
const isSyncingToStore = ref(false);
const payload = ref<ButtonClickedTriggerPayload>(
  props.node?.data?.payload
    ? ({ ...props.node.data.payload } as unknown as ButtonClickedTriggerPayload)
    : {
        tableId: null,
        groups: [],
        notEmptyColumnId: null,
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
</script>

<template>
  <template v-if="props.node && props.node.data">
    <TableSelect
      v-model:model-value="payload.tableId"
      :tables="tables"
      label="Table with button field"
      placeholder="Select table"
    />
    <TableColumnsRadio
      v-model:model-value="payload.notEmptyColumnId"
      :columns="selectedTableColumns"
      label="And the selected field is not empty"
      placeholder="Select column"
    />
    <a-divider />
    <AndOrConditionBuilder
      :model-value="payload.groups"
      :table-columns="selectedTableColumns"
      :operator-options="BUTTON_CONDITION_OPERATOR_OPTIONS"
      :create-empty-condition="createEmptyCondition"
      :create-empty-group="createEmptyGroup"
      empty-label="Add condition group"
      conditions-title="When the following conditions are matched while the button is clicked"
      @update:model-value="onGroupsUpdate"
    />
  </template>
</template>

<style scoped>
.trigger-summary {
  margin-bottom: 12px;
  background-color: #fafafa;
}
</style>
