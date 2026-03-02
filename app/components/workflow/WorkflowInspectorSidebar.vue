<script setup lang="ts">
import { computed } from 'vue';
import { CloseOutlined, SwapOutlined } from '@ant-design/icons-vue';
import type { Node } from '@vue-flow/core';
import {
  WorkflowNodeKind,
  type UpdateNodeDataPayload,
  type WorkflowNodeData,
} from '~/types/workflow';
import { useWorkflowNodeTypeVisual } from '~/composables/workflow/useWorkflowNodeTypeVisual';
import TriggerNodeSettings from '~/components/workflow/settings/TriggerNodeSettings.vue';
import ActionNodeSettings from '~/components/workflow/settings/ActionNodeSettings.vue';
import ConditionNodeSettings from '~/components/workflow/settings/ConditionNodeSettings.vue';
import NotificationNodeSettings from '~/components/workflow/settings/NotificationNodeSettings.vue';
import SwitchNodeTypeOptionDropdown from '~/components/workflow/SwitchNodeTypeOptionDropdown.vue';
import { TRIGGER_NODE_TYPES } from '~/config/triggerNodeTypes';
import { type TriggerNodeTypeKey } from '~/config/triggerNodeTypes';
import { type ActionNodeTypeKey } from '~/config/actionNodeTypes';
import { ACTION_NODE_TYPES } from '~/config/actionNodeTypes';

const props = defineProps<{
  open: boolean;
  selectedNode: Node<WorkflowNodeData> | undefined;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update-node-data', payload: UpdateNodeDataPayload): void;
}>();

const hasSelectedNode = computed(
  () => !!props.selectedNode && !!props.selectedNode.data,
);

const { nodeTypeVisual } = useWorkflowNodeTypeVisual(
  () =>
    (props.selectedNode?.data as WorkflowNodeData | undefined) ?? {
      title: '',
      subtitle: '',
      kind: WorkflowNodeKind.Action,
    },
);

const currentSettingsComponent = computed(() => {
  if (!props.selectedNode?.data) {
    return null;
  }
  switch (props.selectedNode?.data.kind) {
    case WorkflowNodeKind.Trigger:
      return TriggerNodeSettings;
    case WorkflowNodeKind.Condition:
      return ConditionNodeSettings;
    case WorkflowNodeKind.Notification:
      return NotificationNodeSettings;
    case WorkflowNodeKind.Action:
    default:
      return ActionNodeSettings;
  }
});

function onMenuAction(key: string) {
  if (!props.selectedNode) {
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
      emit('update-node-data', {
        nodeId: props.selectedNode?.id!,
        nodeData: {
          ...props.selectedNode?.data!,
          kind: WorkflowNodeKind.Trigger,
          triggerType: selectedType.key,
          title: selectedType.label,
          subtitle: selectedType.subtitle,
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
      emit('update-node-data', {
        nodeId: props.selectedNode?.id!,
        nodeData: {
          ...props.selectedNode?.data!,
          kind: WorkflowNodeKind.Action,
          actionType: selectedType.key,
          title: selectedType.label,
          subtitle: selectedType.subtitle,
        },
      });
    }
  }
}
</script>

<template>
  <transition name="inspector-fade">
    <div v-if="open" class="inspector-float">
      <a-card size="small" class="inspector-card">
        <a-space direction="vertical" :size="12" style="width: 100%">
          <div class="inspector-header">
            <a-typography-title :level="5" style="margin: 0">
              <span
                v-if="hasSelectedNode"
                class="node-type-icon"
                :style="{
                  backgroundColor: nodeTypeVisual.iconBackground,
                }"
              >
                <component
                  :is="nodeTypeVisual.icon"
                  :style="{ color: '#fff' }"
                />
              </span>
              {{ props.selectedNode?.data?.title }}
            </a-typography-title>
            <div>
              <SwitchNodeTypeOptionDropdown
                v-if="
                  props.selectedNode?.data?.kind === WorkflowNodeKind.Action ||
                  props.selectedNode?.data?.kind === WorkflowNodeKind.Trigger
                "
                :node-kind="props.selectedNode?.data.kind!"
                @menu-action="onMenuAction"
                placement="bottomLeft"
                ><
                <template #trigger>
                  <a-button
                    type="text"
                    size="small"
                    aria-label="Switch node type"
                  >
                    <SwapOutlined
                  /></a-button>
                </template>
              </SwitchNodeTypeOptionDropdown>
              <a-button
                type="text"
                size="small"
                aria-label="Close inspector"
                @click="emit('close')"
              >
                <CloseOutlined />
              </a-button>
            </div>
          </div>
          <a-empty
            v-if="!hasSelectedNode"
            description="Select a node in the canvas to edit details."
          />
          <a-form v-else layout="vertical">
            <component
              v-if="currentSettingsComponent"
              :is="currentSettingsComponent"
              :node="selectedNode"
            />
          </a-form>
        </a-space>
      </a-card>
    </div>
  </transition>
</template>

<style scoped>
.inspector-float {
  position: fixed;
  top: 120px;
  right: 12px;
  width: 460px;
  height: calc(100dvh - 150px);
  z-index: 1000;
}

.inspector-card {
  height: 100%;
  border: none !important;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.16);
  border-radius: 12px;
  overflow: hidden;
}

:deep(.inspector-card .ant-card-body) {
  padding: 16px;
}

.inspector-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}

.inspector-header h5 {
  display: flex;
  align-items: center;
  max-width: 80%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-right: 8px;
  border-radius: 3px;
  font-size: 16px;
  min-width: 28px;
}

.inspector-fade-enter-active,
.inspector-fade-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.inspector-fade-enter-from,
.inspector-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (width <= 1024px) {
  .inspector-float {
    position: fixed;
    inset: auto 12px 12px 12px;
    width: auto;
    max-height: 60dvh;
  }
}
</style>
