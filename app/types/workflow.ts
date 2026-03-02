import type { Edge, Node } from '@vue-flow/core';
import type { ActionNodeTypeKey } from '~/config/actionNodeTypes';
import type { ConditionNodeTypeKey } from '~/config/conditionNodeTypes';
import type { TriggerNodeTypeKey } from '~/config/triggerNodeTypes';

export enum WorkflowNodeKind {
  Trigger = 'trigger',
  Action = 'action',
  Condition = 'condition',
  Notification = 'notification',
  NewNode = 'new-node',
}

export enum NodeTemplate {
  Action = 'action',
  Condition = 'condition',
  Notification = 'notification',
}

export interface WorkflowNodeData {
  parentId?: string;
  title: string;
  subtitle: string;
  kind: WorkflowNodeKind;
  triggerType?: TriggerNodeTypeKey;
  actionType?: ActionNodeTypeKey;
  conditionType?: ConditionNodeTypeKey;
  app?: string;
  operation?: string;
  payload?: Record<string, any>;
}

export interface AddNodePayload {
  sourceId: string;
  sourceHandle?: string;
  nodeData: WorkflowNodeData;
}

export interface UpdateNodeDataPayload {
  nodeId: string;
  nodeData: WorkflowNodeData;
}

export interface SavedWorkflowState {
  editorName: string;
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
}

export interface Point {
  x: number;
  y: number;
}
