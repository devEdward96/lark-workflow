<script setup lang="ts">
import type { Node } from '@vue-flow/core';
import type { WorkflowNodeData } from '~/types/workflow';

const props = defineProps<{
  node: Node<WorkflowNodeData> | undefined;
}>();
</script>

<template>
  <template v-if="props.node && props.node.data">
    <a-form-item label="Notification title">
      <a-input
        v-model:value="props.node.data.title"
        placeholder="e.g. Notify account manager"
      />
    </a-form-item>
  </template>
</template>

