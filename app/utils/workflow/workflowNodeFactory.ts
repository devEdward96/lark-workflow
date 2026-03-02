import { nanoid } from 'nanoid';
import type { Edge, Node } from '@vue-flow/core';
import { TriggerNodeTypeKey } from '~/config/triggerNodeTypes';
import { ActionNodeTypeKey } from '~/config/actionNodeTypes';
import { ConditionNodeTypeKey } from '~/config/conditionNodeTypes';
import {
  WorkflowNodeKind,
  type WorkflowNodeData,
} from '~/types/workflow';

type WorkflowGraph = {
  initialNodes: Node<WorkflowNodeData & { parentId?: string }>[];
  initialEdges: Edge[];
};

export const newNodeDefaultData = {
  kind: WorkflowNodeKind.NewNode,
  title: 'New node',
  subtitle: 'New node',
} as const;

const nodeIds = [nanoid(), nanoid(), nanoid(), nanoid(), nanoid(), nanoid(), nanoid()];

export function buildInitialWorkflowGraph(): WorkflowGraph {
  const initialNodes: Node<WorkflowNodeData>[] = [
    {
      id: nodeIds[0]!,
      type: 'workflow',
      position: { x: 400, y: 40 },
      data: {
        kind: WorkflowNodeKind.Trigger,
        triggerType: TriggerNodeTypeKey.ButtonClicked,
        title: 'When a button is clicked',
        subtitle: 'From bot menu or message card',
      },
    },
    {
      id: nodeIds[1]!,
      type: 'workflow',
      position: { x: 400, y: 180 },
      data: {
        parentId: nodeIds[0]!,
        kind: WorkflowNodeKind.Action,
        actionType: ActionNodeTypeKey.HttpRequest,
        title: 'Send HTTP request',
        subtitle: 'Send an HTTP request to a specified URL',
        payload: {
          url: 'https://api.example.com/data',
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            key: 'value',
          },
        },
      },
    },
    {
      id: nodeIds[2]!,
      type: 'workflow',
      position: { x: 400, y: 340 },
      data: {
        parentId: nodeIds[1]!,
        kind: WorkflowNodeKind.Condition,
        conditionType: ConditionNodeTypeKey.IfElse,
        title: 'If/Else',
        subtitle: 'Evaluate a branching rule',
      },
    },
    {
      id: nodeIds[3]!,
      type: 'workflow',
      position: { x: 100, y: 600 },
      data: {
        parentId: nodeIds[2]!,
        kind: WorkflowNodeKind.Action,
        actionType: ActionNodeTypeKey.SendLarkMessage,
        title: 'Send Lark message',
        subtitle: 'Send a message to a selected Lark chat.',
        payload: {
          message: 'Available slots found',
          chatId: '1234567890',
        },
      },
    },
    {
      id: nodeIds[4]!,
      type: 'workflow',
      position: { x: 700, y: 600 },
      data: {
        parentId: nodeIds[3]!,
        kind: WorkflowNodeKind.Action,
        actionType: ActionNodeTypeKey.SendLarkMessage,
        title: 'Send Lark message',
        subtitle: 'Send a message to a selected Lark chat.',
        payload: {
          message: 'No available slots were found',
          chatId: '1234567890',
        },
      },
    },
    {
      id: nodeIds[5]!,
      type: 'workflow',
      position: { x: 100, y: 750 },
      data: {
        parentId: nodeIds[4]!,
        kind: WorkflowNodeKind.NewNode,
        title: 'New node',
        subtitle: 'New node',
      },
    },
    {
      id: nodeIds[6]!,
      type: 'workflow',
      position: { x: 700, y: 750 },
      data: {
        parentId: nodeIds[5]!,
        ...newNodeDefaultData,
      },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: `e-${initialNodes[0]!.id}-${initialNodes[1]!.id}`,
      source: initialNodes[0]!.id,
      target: initialNodes[1]!.id,
      type: 'smoothstep',
      animated: true,
    },
    {
      id: `e-${initialNodes[1]!.id}-${initialNodes[2]!.id}`,
      source: initialNodes[1]!.id,
      target: initialNodes[2]!.id,
      type: 'smoothstep',
    },
    {
      id: `e-${initialNodes[2]!.id}-${initialNodes[3]!.id}`,
      source: initialNodes[2]!.id,
      sourceHandle: 'yes',
      target: initialNodes[3]!.id,
      type: 'smoothstep',
      label: 'YES',
      labelStyle: { fill: '#16a34a', fontWeight: 600 },
    },
    {
      id: `e-${initialNodes[2]!.id}-${initialNodes[4]!.id}`,
      source: initialNodes[2]!.id,
      sourceHandle: 'no',
      target: initialNodes[4]!.id,
      type: 'smoothstep',
      label: 'NO',
      labelStyle: { fill: '#dc2626', fontWeight: 600 },
    },
    {
      id: `e-${initialNodes[3]!.id}-${initialNodes[5]!.id}`,
      source: initialNodes[3]!.id,
      target: initialNodes[5]!.id,
      type: 'smoothstep',
      animated: true,
    },
    {
      id: `e-${initialNodes[4]!.id}-${initialNodes[6]!.id}`,
      source: initialNodes[4]!.id,
      target: initialNodes[6]!.id,
      type: 'smoothstep',
      animated: true,
    },
  ];

  return { initialNodes, initialEdges };
}
