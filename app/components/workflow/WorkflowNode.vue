<script setup lang="ts">
import { type NodeProps } from '@vue-flow/core';
import NodeActionDropdown from '~/components/workflow/NodeActionDropdown.vue';
import type {
  AddNodePayload,
  UpdateNodeDataPayload,
  WorkflowNodeData,
} from '~/types/workflow';
import { WorkflowNodeKind } from '~/types/workflow';
import {
  ACTION_NODE_TYPES,
  type ActionNodeTypeOption,
  type ActionNodeTypeKey,
} from '~/config/actionNodeTypes';
import {
  TRIGGER_NODE_TYPES,
  type TriggerNodeTypeKey,
} from '~/config/triggerNodeTypes';
import {
  CONDITION_NODE_TYPES,
  type ConditionNodeTypeKey,
  type ConditionNodeTypeOption,
} from '~/config/conditionNodeTypes';
import NewNodeOptionDropdown from '~/components/workflow/NewNodeOptionDropdown.vue';
import { useWorkflowNodeTypeVisual } from '~/composables/workflow/useWorkflowNodeTypeVisual';

const props = defineProps<NodeProps<WorkflowNodeData>>();
const emit = defineEmits<{
  addActionNode: [payload: AddNodePayload];
  addConditionNode: [payload: AddNodePayload];
  updateNodeData: [payload: UpdateNodeDataPayload];
  deleteNode: [nodeId: string];
}>();

const { kindIcon, nodeTypeVisual } = useWorkflowNodeTypeVisual(
  () => props.data,
);

function addActionNode(node: ActionNodeTypeOption) {
  emit('addActionNode', {
    sourceId: props.id,
    sourceHandle: undefined,
    nodeData: {
      kind: WorkflowNodeKind.Action,
      actionType: node.key,
      title: node.label,
      subtitle: node.subtitle,
      payload: {},
    },
  });
}

function addConditionNode(node: ConditionNodeTypeOption) {
  emit('addConditionNode', {
    sourceId: props.id,
    sourceHandle: undefined,
    nodeData: {
      kind: WorkflowNodeKind.Condition,
      conditionType: node.key,
      title: node.label,
      subtitle: node.subtitle,
      payload: {},
    },
  });
}

function onNodeMenuClick(key: string) {
  if (key.startsWith('delete-node')) {
    onDeleteNode();
    return;
  }

  if (key.startsWith('trigger-type:')) {
    const triggerTypeKey = key.replace(
      'trigger-type:',
      '',
    ) as TriggerNodeTypeKey;
    const selectedType = TRIGGER_NODE_TYPES.find(
      (type) => type.key === triggerTypeKey,
    );
    if (selectedType && !selectedType.isComingSoon) {
      emit('updateNodeData', {
        nodeId: props.id,
        nodeData: {
          ...props.data,
          title: selectedType.label,
          subtitle: selectedType.subtitle,
          triggerType: selectedType.key,
        },
      });
    }
  }

  if (key.startsWith('action-type:')) {
    const actionTypeKey = key.replace('action-type:', '') as ActionNodeTypeKey;
    const selectedType = ACTION_NODE_TYPES.find(
      (type) => type.key === actionTypeKey,
    );
    if (selectedType && !selectedType.isComingSoon) {
      emit('updateNodeData', {
        nodeId: props.id,
        nodeData: {
          ...props.data,
          title: selectedType.label,
          subtitle: selectedType.subtitle,
          actionType: selectedType.key,
        },
      });
    }
  }
}

function adNewNode(key: string) {
  if (key.startsWith('action-type:')) {
    const actionTypeKey = key.replace('action-type:', '') as ActionNodeTypeKey;
    addActionNode(
      ACTION_NODE_TYPES.find(
        (type) => type.key === actionTypeKey,
      ) as ActionNodeTypeOption,
    );
  }
  if (key.startsWith('condition-type:')) {
    const conditionTypeKey = key.replace(
      'condition-type:',
      '',
    ) as ConditionNodeTypeKey;
    addConditionNode(
      CONDITION_NODE_TYPES.find(
        (type) => type.key === conditionTypeKey,
      ) as ConditionNodeTypeOption,
    );
  }
}

function onDeleteNode() {
  emit('deleteNode', props.id);
}
</script>

<template>
  <div class="workflow-node">
    <a-card size="small" :class="['node-card', data.kind]">
      <div class="node-badge" v-if="data.kind === WorkflowNodeKind.Trigger">
        <component :is="kindIcon" :style="{ color: '#000' }" />
      </div>
      <div class="node-badge" v-if="data.kind === WorkflowNodeKind.Condition">
        <component :is="kindIcon" :style="{ color: '#000' }" />
      </div>
      <a-tag
        v-if="data.kind !== WorkflowNodeKind.NewNode"
        class="node-kind"
        :color="
          props.data.kind === WorkflowNodeKind.NewNode
            ? '#fff'
            : nodeTypeVisual.iconColor
        "
      >
        <span
          class="node-kind-icon"
          :style="{ backgroundColor: nodeTypeVisual.iconColor }"
        >
          <component
            :is="nodeTypeVisual.icon"
            :style="{
              color:
                props.data.kind === WorkflowNodeKind.NewNode ? '#000' : '#fff',
            }"
          />
        </span>
      </a-tag>
      <NewNodeOptionDropdown
        v-if="data.kind === WorkflowNodeKind.NewNode"
        :node-kind="data.kind"
        @menu-action="adNewNode"
      />
      <div class="node-content" v-if="data.kind !== WorkflowNodeKind.NewNode">
        <a-typography-title :level="5" class="title" :ellipsis="{ width: 240 }">
          {{ data.title }}
        </a-typography-title>
        <a-typography-text
          type="secondary"
          class="subtitle"
          :ellipsis="{ width: 240 }"
        >
          {{ data.subtitle }}
        </a-typography-text>
      </div>
      <div class="node-actions" v-if="data.kind !== WorkflowNodeKind.NewNode">
        <NodeActionDropdown
          :node-kind="data.kind"
          @menu-action="onNodeMenuClick"
        />
      </div>
    </a-card>
  </div>
</template>

<style scoped>
.workflow-node {
  position: relative;
  width: 400px;
  height: 90px;
}

.node-card {
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border: none !important;
  width: 100%;
  height: 100%;
}

.node-badge {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}

.node-card.new-node {
  background-color: transparent !important;
  padding: 0 !important;
  align-items: flex-start;
}

:deep(.node-card .ant-card-body) {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

:deep(.node-card.new-node .ant-card-body) {
  padding: 0 !important;
  align-items: flex-start;
}

:deep(.node-card.new-node .ant-card-body .node-kind) {
  margin: 0 !important;
}

.node-kind {
  width: 50px;
  height: 50px;
  min-width: 50px;
  display: flex;
  margin-right: 12px !important;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
}

:deep(.node-kind .node-kind-icon) {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

:deep(.node-kind .node-kind-icon svg) {
  width: 24px;
  height: 24px;
}

:deep(.node-card.new-node .ant-card-body .node-kind .node-kind-icon svg) {
  width: 24px;
  height: 24px;
}

.node-content {
  flex: 1;
}

.node-actions {
  flex: 0;
}

.title {
  margin: 0 !important;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.subtitle {
  font-size: 12px;
  line-height: 1.3;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: top;
  margin-top: 2px;
}

.floating {
  position: absolute;
  top: 50%;
  right: -56px;
  transform: translateY(-50%);
}

.plus {
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.branch-yes {
  border-color: #52c41a !important;
  color: #389e0d !important;
}

.branch-no {
  border-color: #ff4d4f !important;
  color: #cf1322 !important;
}

.branch-labels {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
}

.branch-actions {
  margin-top: 8px;
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.icon-yes {
  color: #389e0d;
}

.icon-no {
  color: #cf1322;
}

:deep(.ant-card-body) {
  padding: 12px 14px !important;
}

:deep(.ant-tag) {
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 11px;
}
</style>
