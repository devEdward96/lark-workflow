import type { Component } from 'vue';
import { computed } from 'vue';
import {
  BellOutlined,
  PlusOutlined,
  QuestionCircleFilled,
  ThunderboltFilled,
} from '@ant-design/icons-vue';
import { ACTION_NODE_TYPES } from '~/config/actionNodeTypes';
import { CONDITION_NODE_TYPES } from '~/config/conditionNodeTypes';
import { TRIGGER_NODE_TYPES } from '~/config/triggerNodeTypes';
import { WorkflowNodeKind, type WorkflowNodeData } from '~/types/workflow';

type NodeTypeVisual = {
  icon: Component;
  iconColor: string;
  iconBackground: string;
};

export function useWorkflowNodeTypeVisual(nodeData: () => WorkflowNodeData) {
  const kindIcon = computed<Component>(() => {
    switch (nodeData().kind) {
      case WorkflowNodeKind.Action:
        return ThunderboltFilled;
      case WorkflowNodeKind.Condition:
        return QuestionCircleFilled;
      case WorkflowNodeKind.Notification:
        return BellOutlined;
      case WorkflowNodeKind.NewNode:
        return PlusOutlined;
      default:
        return ThunderboltFilled;
    }
  });

  const selectedTriggerType = computed(() => {
    const data = nodeData();
    if (data.kind !== WorkflowNodeKind.Trigger || !data.triggerType) {
      return undefined;
    }
    return TRIGGER_NODE_TYPES.find((type) => type.key === data.triggerType);
  });

  const selectedActionType = computed(() => {
    const data = nodeData();
    if (data.kind !== WorkflowNodeKind.Action || !data.actionType) {
      return undefined;
    }
    return ACTION_NODE_TYPES.find((type) => type.key === data.actionType);
  });

  const selectedConditionType = computed(() => {
    const data = nodeData();
    if (data.kind !== WorkflowNodeKind.Condition || !data.conditionType) {
      return undefined;
    }
    return CONDITION_NODE_TYPES.find((type) => type.key === data.conditionType);
  });

  const nodeTypeVisual = computed<NodeTypeVisual>(() => {
    if (selectedTriggerType.value) {
      return {
        icon: selectedTriggerType.value.icon,
        iconColor: selectedTriggerType.value.iconColor,
        iconBackground:
          selectedTriggerType.value.iconBackground ??
          selectedTriggerType.value.iconColor,
      };
    }

    if (selectedActionType.value) {
      return {
        icon: selectedActionType.value.icon,
        iconColor: selectedActionType.value.iconColor,
        iconBackground:
          selectedActionType.value.iconBackground ??
          selectedActionType.value.iconColor,
      };
    }

    if (selectedConditionType.value) {
      return {
        icon: selectedConditionType.value.icon,
        iconColor: selectedConditionType.value.iconColor,
        iconBackground:
          selectedConditionType.value.iconBackground ??
          selectedConditionType.value.iconColor,
      };
    }

    return {
      icon: kindIcon.value,
      iconColor: '#ffffff',
      iconBackground: '#1677ff',
    };
  });

  return {
    kindIcon,
    selectedTriggerType,
    selectedActionType,
    selectedConditionType,
    nodeTypeVisual,
  };
}
