import { computed, onMounted, ref } from 'vue';
import type { Edge, Node } from '@vue-flow/core';
import { defineStore } from 'pinia';
import {
  type AddNodePayload,
  type UpdateNodeDataPayload,
  type WorkflowNodeData,
} from '~/types/workflow';
import {
  buildInitialWorkflowGraph,
  newNodeDefaultData,
} from '~/utils/workflow/workflowNodeFactory';
import {
  hasSavedWorkflowState,
  restoreWorkflowState,
  saveWorkflowState,
} from '~/utils/workflow/workflowPersistence';
import { nanoid } from 'nanoid';
import initialTables from '~/data/tables';

export const useWorkflowStore = defineStore('workflow', () => {
  const { initialNodes, initialEdges } = buildInitialWorkflowGraph();

  const nodes = ref<Node<WorkflowNodeData>[]>(structuredClone(initialNodes));
  const edges = ref<Edge[]>(structuredClone(initialEdges));
  const tables = ref<typeof initialTables>(structuredClone(initialTables));
  const selectedNodeId = ref<string>('action');
  const editorName = ref('Send Messages Workflow');
  const statusMessage = ref('No saved workflow yet.');
  const flowInstance = ref<unknown>(null);

  const selectedNode = computed(() =>
    nodes.value.find((node) => node.id === selectedNodeId.value),
  );

  const workflowJson = computed(() =>
    JSON.stringify(
      {
        editorName: editorName.value,
        nodes: nodes.value,
        edges: edges.value,
      },
      null,
      2,
    ),
  );

  function onFlowInit(instance: unknown) {
    flowInstance.value = instance;
  }

  function addConditionNode(payload: AddNodePayload) {
    const sourceNode = nodes.value.find((node) => node.id === payload.sourceId);
    if (!sourceNode) {
      return;
    }

    nodes.value = nodes.value.map((node) => {
      if (node.id === payload.sourceId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...payload.nodeData,
          },
        };
      }
      return node;
    });

    edges.value = edges.value.map((edge) =>
      edge.target === sourceNode.id
        ? {
          ...edge,
          animated: false,
        }
        : edge,
    );

    const defaultYOffset = 250;
    const xOffsetForYesNode = sourceNode.position.x - 250;
    const xOffsetForNoNode = sourceNode.position.x + 250;

    const yesNodeId = nanoid();
    const noNodeId = nanoid();
    const newNodes: Node<WorkflowNodeData>[] = [
      {
        id: yesNodeId,
        type: 'workflow',
        position: {
          x: xOffsetForYesNode,
          y: sourceNode.position.y + defaultYOffset,
        },
        data: {
          parentId: payload.sourceId,
          ...newNodeDefaultData,
        },
      },
      {
        id: noNodeId,
        type: 'workflow',
        position: {
          x: xOffsetForNoNode,
          y: sourceNode.position.y + defaultYOffset,
        },
        data: {
          parentId: payload.sourceId,
          ...newNodeDefaultData,
        },
      },
    ];

    const newEdges: Edge[] = [
      {
        id: `e-${payload.sourceId}-${yesNodeId}`,
        source: payload.sourceId,
        sourceHandle: payload.sourceHandle,
        target: yesNodeId,
        type: 'smoothstep',
        animated: true,
        label: 'YES',
        labelStyle: { fill: '#16a34a', fontWeight: 600 },
      },
      {
        id: `e-${payload.sourceId}-${noNodeId}`,
        source: payload.sourceId,
        sourceHandle: payload.sourceHandle,
        target: noNodeId,
        type: 'smoothstep',
        animated: true,
        label: 'NO',
        labelStyle: { fill: '#dc2626', fontWeight: 600 },
      },
    ];

    nodes.value = [...nodes.value, ...newNodes];
    edges.value = [...edges.value, ...newEdges];
    selectedNodeId.value = payload.sourceId;
  }

  function addActionNode(payload: AddNodePayload) {
    const sourceNode = nodes.value.find((node) => node.id === payload.sourceId);
    if (!sourceNode) {
      return;
    }

    nodes.value = nodes.value.map((node) => {
      if (node.id === payload.sourceId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...payload.nodeData,
          },
        };
      }
      return node;
    });

    edges.value = edges.value.map((edge) => {
      if (edge.target === sourceNode.id) {
        return {
          ...edge,
          animated: false,
        };
      }
      return edge;
    });

    const yOffset = 150;

    const nodeId = nanoid();
    const newNode: Node<WorkflowNodeData> = {
      id: nodeId,
      type: 'workflow',
      position: {
        x: sourceNode.position.x,
        y: sourceNode.position.y + yOffset,
      },
      data: {
        parentId: payload.sourceId,
        ...newNodeDefaultData,
      },
    };
    nodes.value = [...nodes.value, newNode];

    const newEdge: Edge = {
      id: `e-${payload.sourceId}-${nodeId}`,
      source: payload.sourceId,
      sourceHandle: payload.sourceHandle,
      target: nodeId,
      type: 'smoothstep',
      animated: true,
    };
    edges.value = [...edges.value, newEdge];
    selectedNodeId.value = payload.sourceId;

    return {
      newNode,
      newEdge,
    };
  }

  function updateNodeData(payload: UpdateNodeDataPayload) {
    nodes.value = nodes.value.map((node) =>
      node.id === payload.nodeId
        ? {
          ...node,
          data: {
            ...payload.nodeData,
          },
        }
        : node,
    );
  }

  function findChildNodeIds(parentId: string) {
    const children: string[] = [];
    const queue: string[] = [parentId];

    while (queue.length > 0) {
      const currentId = queue.shift();
      if (!currentId) {
        continue;
      }
      const directChildren = nodes.value.filter(
        (node) => node.data?.parentId === currentId,
      );
      for (const child of directChildren) {
        children.push(child.id);
        queue.push(child.id);
      }
    }

    return children;
  }

  function deleteNode(nodeId: string) {
    const childNodes = findChildNodeIds(nodeId);
    (flowInstance.value as any)?.removeNodes([...childNodes]);
    setTimeout(() => {
      nodes.value = [
        ...nodes.value.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                ...newNodeDefaultData,
              },
            };
          }
          return node;
        }),
      ];
    });
  }

  function saveWorkflow() {
    statusMessage.value = saveWorkflowState(
      editorName.value,
      nodes.value,
      edges.value,
    );
  }

  function restoreWorkflow() {
    const result = restoreWorkflowState();
    statusMessage.value = result.message;

    if (!result.success) {
      return;
    }

    editorName.value = result.state.editorName || editorName.value;
    nodes.value = result.state.nodes;
    edges.value = result.state.edges;
    selectedNodeId.value = result.state.nodes[0]?.id || '';
  }

  function resetWorkflow() {
    const { initialNodes: freshNodes, initialEdges: freshEdges } =
      buildInitialWorkflowGraph();
    editorName.value = 'Send Messages Workflow';
    nodes.value = structuredClone(freshNodes);
    edges.value = structuredClone(freshEdges);
    selectedNodeId.value = 'action';
    statusMessage.value = 'Workflow reset to initial template.';
  }

  onMounted(() => {
    if (hasSavedWorkflowState()) {
      statusMessage.value =
        'Saved workflow available. Click Restore to load it.';
    }
  });

  return {
    // state
    nodes,
    edges,
    selectedNodeId,
    editorName,
    statusMessage,
    tables,
    // getters
    selectedNode,
    workflowJson,
    // actions
    onFlowInit,
    addActionNode,
    addConditionNode,
    saveWorkflow,
    restoreWorkflow,
    resetWorkflow,
    updateNodeData,
    deleteNode,
  };
});

