<script setup lang="ts">
import type { Node } from '@vue-flow/core';
import type { WorkflowNodeData } from '~/types/workflow';

const props = defineProps<{
  node: Node<WorkflowNodeData> | undefined;
}>();
</script>

<template>
  <template v-if="props.node && props.node.data">
    <a-form-item label="Condition type">
      <a-input
        v-model:value="props.node.data.conditionType"
        placeholder="e.g. field_equals"
      />
    </a-form-item>
  </template>
</template>

