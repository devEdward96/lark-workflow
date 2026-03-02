<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  ReloadOutlined,
  SaveOutlined,
  UndoOutlined,
} from '@ant-design/icons-vue';
import { VueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import WorkflowNode from '~/components/workflow/WorkflowNode.vue';
import WorkflowInspectorSidebar from '~/components/workflow/WorkflowInspectorSidebar.vue';
import { useWorkflowEditorState } from '~/composables/workflow/useWorkflowEditorState';

import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

const {
  nodes,
  edges,
  selectedNodeId,
  editorName,
  selectedNode,
  onFlowInit,
  addConditionNode,
  addActionNode,
  saveWorkflow,
  restoreWorkflow,
  resetWorkflow,
  updateNodeData,
  deleteNode,
} = useWorkflowEditorState();

const isInspectorOpen = ref(true);

watch(selectedNode, (node) => {
  if (node && node.data) {
    isInspectorOpen.value = true;
  }
});
</script>

<template>
  <a-config-provider
    :theme="{
      token: {
        borderRadius: 10,
      },
    }"
  >
    <a-layout class="workflow-layout">
      <a-layout-header class="editor-header">
        <div class="header-title">
          <a-typography-text type="secondary">Workflow</a-typography-text>
          <a-input
            v-model:value="editorName"
            class="workflow-name"
            aria-label="Workflow name"
            size="large"
          />
        </div>
        <a-space class="header-actions">
          <a-button type="primary" @click="saveWorkflow">
            <template #icon>
              <SaveOutlined />
            </template>
            Save
          </a-button>
          <a-button @click="restoreWorkflow">
            <template #icon>
              <ReloadOutlined />
            </template>
            Restore
          </a-button>
          <a-button @click="resetWorkflow">
            <template #icon>
              <UndoOutlined />
            </template>
            Reset
          </a-button>
          <a-tag color="blue">Draft</a-tag>
        </a-space>
      </a-layout-header>

      <a-layout class="editor-content">
        <a-layout-content class="canvas">
          <VueFlow
            v-model:nodes="nodes"
            v-model:edges="edges"
            class="flow"
            :min-zoom="0.6"
            :max-zoom="2"
            :nodes-draggable="false"
            :default-viewport="{ zoom: 1.1 }"
            @init="onFlowInit"
            center-view
            :delete-key-code="null"
            @node-click="({ node }) => (selectedNodeId = node.id)"
            @pane-click="selectedNodeId = ''"
          >
            <template #node-workflow="nodeProps">
              <WorkflowNode
                v-bind="nodeProps"
                @add-action-node="addActionNode"
                @add-condition-node="addConditionNode"
                @update-node-data="updateNodeData"
                @delete-node="deleteNode"
              />
            </template>

            <Background
              pattern-color="#d4d4d4"
              :gap="24"
              :size="2"
              variant="dots"
            />
            <MiniMap :position="'bottom-left'" />
            <Controls :position="'top-left'" />
          </VueFlow>
        </a-layout-content>
      </a-layout>
      <WorkflowInspectorSidebar
        :open="isInspectorOpen && !!selectedNode && !!selectedNode.data"
        :selected-node="selectedNode"
        @update-node-data="updateNodeData"
        @close="
          () => {
            isInspectorOpen = false;
            selectedNodeId = '';
          }
        "
      />
    </a-layout>
  </a-config-provider>
</template>

<style scoped>
.workflow-layout {
  height: 100dvh;
  background: #f5f5f5;
}

.editor-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: auto;
  line-height: normal;
  padding: 12px 16px !important;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
}

.header-title {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.workflow-name {
  min-width: 280px;
}

.editor-content {
  min-height: 0;
}

.canvas {
  border-right: 1px solid #f0f0f0;
  background: #fafafa;
}

.flow {
  height: 100%;
}

.inspector {
  padding: 12px !important;
  border-left: 0 !important;
}

.inspector-card {
  height: 100%;
  border: none !important;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.drag-palette {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.drag-item {
  text-align: left;
  cursor: grab;
}

.drag-item:active {
  cursor: grabbing;
}

.hint {
  font-size: 12px;
}

@media (width <= 1024px) {
  .workflow-name {
    min-width: 220px;
  }
}
</style>
