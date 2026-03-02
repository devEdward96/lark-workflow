<script setup lang="ts">
import { computed } from 'vue';
import { PlusCircleFilled } from '@ant-design/icons-vue';

export interface ConditionOption {
  id: string;
  fieldName: string | null;
  operator: string;
  value: string;
}

export interface ConditionGroupOption {
  id: string;
  conditions: ConditionOption[];
}

export interface TableColumnOption {
  id: number;
  name: string;
}

export interface OperatorOption {
  value: string;
  label: string;
}

const props = withDefaults(
  defineProps<{
    modelValue: ConditionGroupOption[];
    tableColumns: TableColumnOption[];
    operatorOptions: OperatorOption[];
    createEmptyCondition: () => ConditionOption;
    createEmptyGroup: () => ConditionGroupOption;
    emptyLabel?: string;
    conditionsTitle?: string;
    isSingleGroup?: boolean;
    minGroups?: number;
  }>(),
  {
    emptyLabel: 'Add condition group',
    conditionsTitle:
      'When the following conditions are matched while the button is clicked',
    isSingleGroup: false,
    minGroups: 0,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', groups: ConditionGroupOption[]): void;
}>();

function emitGroups(groups: ConditionGroupOption[]) {
  emit('update:modelValue', groups);
}

function addGroup() {
  emitGroups([...props.modelValue, props.createEmptyGroup()]);
}

function removeGroup(index: number) {
  emitGroups(props.modelValue.filter((_, i) => i !== index));
}

function addCondition(groupIndex: number) {
  const group = props.modelValue[groupIndex];
  if (!group) return;
  const next = [...props.modelValue];
  next[groupIndex] = {
    ...group,
    conditions: [...group.conditions, props.createEmptyCondition()],
  };
  emitGroups(next);
}

function removeCondition(groupIndex: number, conditionIndex: number) {
  const group = props.modelValue[groupIndex];
  if (!group) return;
  if (group.conditions.length <= 1) {
    removeGroup(groupIndex);
    return;
  }
  const next = [...props.modelValue];
  next[groupIndex] = {
    ...group,
    conditions: group.conditions.filter((_, i) => i !== conditionIndex),
  };
  emitGroups(next);
}

function patchCondition(
  groupIndex: number,
  conditionIndex: number,
  patch: Partial<ConditionOption>,
) {
  const group = props.modelValue[groupIndex];
  if (!group) return;
  const cond = group.conditions[conditionIndex];
  if (!cond) return;
  const next = [...props.modelValue];
  next[groupIndex] = {
    ...group,
    conditions: group.conditions.map((c, i) =>
      i === conditionIndex ? { ...c, ...patch } : c,
    ),
  };
  emitGroups(next);
}

const removeButtonVisibility = computed(
  () =>
    (
      conditionIndex: number,
      conditionCount: number,
    ): 'visible' | 'hidden' => {
      const hideWhenFirstOnly =
        (props.isSingleGroup && conditionIndex === 0) ||
        (props.minGroups > 0 &&
          props.modelValue.length <= props.minGroups &&
          conditionIndex === 0);
      if (hideWhenFirstOnly) return 'hidden';
      return conditionCount > 0 ? 'visible' : 'hidden';
    },
);
</script>

<template>
  <div class="and-or-condition-builder">
    <a-button
      v-if="modelValue.length === 0 && !isSingleGroup"
      type="default"
      @click="addGroup"
    >
      <template #icon>
        <PlusCircleFilled />
      </template>
      {{ emptyLabel }}
    </a-button>

    <div v-if="modelValue.length > 0" class="conditions-section">
      <slot name="conditions-title">
        <a-typography-text>
          {{ conditionsTitle }}
        </a-typography-text>
      </slot>

      <div
        v-for="(group, groupIndex) in modelValue"
        :key="group.id"
        class="condition-group-wrapper"
      >
        <div v-if="groupIndex > 0" class="or-divider">Or</div>

        <a-card size="small" class="condition-group-card">
          <div
            v-for="(condition, conditionIndex) in group.conditions"
            :key="condition.id"
            class="condition-row"
          >
            <a-select
              :value="condition.fieldName"
              placeholder="Field"
              class="condition-field-select"
              @update:value="
                (v: string) =>
                  patchCondition(groupIndex, conditionIndex, { fieldName: v })
              "
            >
              <a-select-option
                v-for="column in tableColumns"
                :key="column.id"
                :value="column.name"
              >
                {{ column.name }}
              </a-select-option>
            </a-select>

            <a-select
              :value="condition.operator"
              class="condition-operator-select"
              @update:value="
                (v: string) =>
                  patchCondition(groupIndex, conditionIndex, { operator: v })
              "
            >
              <a-select-option
                v-for="opt in operatorOptions"
                :key="opt.value"
                :value="opt.value"
              >
                {{ opt.label }}
              </a-select-option>
            </a-select>

            <a-input
              :value="condition.value"
              class="condition-value-input"
              style="flex: 1"
              placeholder="Enter here"
              @update:value="
                (v: string) =>
                  patchCondition(groupIndex, conditionIndex, { value: v })
              "
            />

            <a-button
              :style="{
                visibility: removeButtonVisibility(
                  conditionIndex,
                  group.conditions.length,
                ),
              }"
              type="text"
              size="small"
              @click="removeCondition(groupIndex, conditionIndex)"
            >
              ✕
            </a-button>
          </div>

          <a-button
            type="ghost"
            class="and-button"
            @click="addCondition(groupIndex)"
          >
            + And
          </a-button>
        </a-card>
      </div>
      <a-button v-if="!isSingleGroup" class="or-button" @click="addGroup">
        + Or
      </a-button>
    </div>
  </div>
</template>

<style scoped>
.conditions-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.condition-group-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.condition-group-card {
  background-color: #fafafa;
}

.condition-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: row;
}

.condition-field-select {
  width: 30%;
}

.condition-operator-select {
  width: 20%;
}

.condition-value-input {
  flex: 1;
}

.and-button {
  padding-left: 0;
  margin-top: 4px;
}

.or-divider {
  text-align: center;
  font-size: 13px;
  color: #8c8c8c;
}

.or-button {
  margin-top: 8px;
}
</style>
