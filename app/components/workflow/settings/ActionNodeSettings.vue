<script setup lang="ts">
import type { Node } from '@vue-flow/core';
import type { WorkflowNodeData } from '~/types/workflow';

const props = defineProps<{
  node: Node<WorkflowNodeData> | undefined;
}>();
</script>

<template>
  <template v-if="props.node && props.node.data">
    <a-form-item label="Application">
      <a-input
        v-model:value="props.node.data.app"
        placeholder="e.g. Lark Docs"
      />
    </a-form-item>

    <a-form-item label="Operation">
      <a-input
        v-model:value="props.node.data.operation"
        placeholder="e.g. Update client record"
      />
    </a-form-item>
  </template>
</template>

