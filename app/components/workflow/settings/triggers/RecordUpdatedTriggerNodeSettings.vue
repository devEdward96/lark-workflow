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
import TableColumnsCheckbox from '~/components/workflow/settings/common/TableColumnsCheckbox.vue';
import TriggerLimitSettings from '~/components/workflow/settings/common/TriggerLimitSettings.vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import type { ColumnTriggerConfig } from '~/components/workflow/settings/common/TableColumnsCheckbox.vue';

const recordOptions: RecordOption[] = [
  {
    label: 'All records',
    value: 'all',
  },
  {
    label: 'Records that match the filter conditions',
    value: 'filtered',
  },
];

const filterRecordOptions: RecordOption[] = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Any',
    value: 'any',
  },
];

interface RecordOption {
  label: string;
  value: string;
}

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
  recordOption: 'all' | 'filtered';
  columns: number[];
  filterConditions: ButtonConditionGroup[];
  filterRecordOption: 'all' | 'any';
  triggerConfigByColumnId: Record<number, ColumnTriggerConfig>;
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

const payload = ref<ButtonClickedTriggerPayload>(
  props.node?.data?.payload
    ? {
        ...(props.node.data.payload as ButtonClickedTriggerPayload),
        triggerLimitKeys: (
          props.node.data.payload as ButtonClickedTriggerPayload
        ).triggerLimitKeys ?? [...defaultTriggerLimitKeys],
      }
    : {
        tableId: null,
        groups: [],
        recordOption: 'all',
        columns: [],
        filterRecordOption: 'all',
        filterConditions: [],
        triggerConfigByColumnId: {},
        triggerLimitKeys: [...defaultTriggerLimitKeys],
      },
);

watch(
  () => payload.value.recordOption,
  () => {
    if (payload.value.recordOption === 'filtered') {
      payload.value.filterConditions = [createEmptyGroup()];
    }
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

function onFilterConditionsUpdate(conditions: ConditionGroupOption[]) {
  payload.value.filterConditions = conditions as ButtonConditionGroup[];
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
    <a-form-item :label="'Record option'">
      <a-select
        :value="payload.recordOption"
        placeholder="Select record option"
        style="width: 100%"
        allow-clear
        @update:value="
          (v: string) => (payload.recordOption = v as 'all' | 'filtered')
        "
      >
        <a-select-option
          v-for="option in recordOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <AndOrConditionBuilder
      v-if="payload.recordOption === 'filtered'"
      :model-value="payload.filterConditions"
      :table-columns="selectedTableColumns"
      :operator-options="BUTTON_CONDITION_OPERATOR_OPTIONS"
      :create-empty-condition="createEmptyFilterCondition"
      :create-empty-group="createEmptyFilterGroup"
      empty-label="Add condition group"
      :is-single-group="true"
      conditions-title="When the following conditions are matched while the button is clicked"
      @update:model-value="onFilterConditionsUpdate"
    >
      <template #conditions-title>
        <div class="filter-records-title">
          <div class="filter-records-title-text">
            <a-typography-text> Filter records </a-typography-text>
            <a-tooltip>
              <template #title
                >Records that meet the conditions will be displayed.</template
              >
              <question-circle-outlined />
            </a-tooltip>
          </div>
          <div class="filter-records-option">
            <a-typography-text> metting </a-typography-text>
            <a-select
              :value="payload.filterRecordOption"
              placeholder="Select filter record option"
              style="width: 60px"
              size="small"
              @update:value="
                (v: string) => (payload.filterRecordOption = v as 'all' | 'any')
              "
            >
              <a-select-option
                v-for="option in filterRecordOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </a-select-option>
            </a-select>
            <a-typography-text> of the conditions </a-typography-text>
          </div>
        </div>
      </template>
    </AndOrConditionBuilder>
    <a-divider v-if="payload.recordOption === 'filtered'" />
    <TableColumnsCheckbox
      v-if="payload.tableId !== null"
      v-model:model-value="payload.columns"
      :columns="selectedTableColumns"
      v-model:trigger-config-by-column-id="payload.triggerConfigByColumnId"
      label="Select fields"
      placeholder="Select columns"
    />
    <TriggerLimitSettings v-model:model-value="payload.triggerLimitKeys" />
    <a-divider />
    <AndOrConditionBuilder
      v-if="payload.tableId !== null"
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
