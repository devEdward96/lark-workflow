import { useWorkflowStore } from '~/stores/workflow';

export function useWorkflowEditorState() {
  const store = useWorkflowStore();
  const {
    nodes,
    edges,
    tables,
    selectedNodeId,
    editorName,
    statusMessage,
    selectedNode,
    workflowJson,
  } = storeToRefs(store);

  return {
    nodes,
    edges,
    tables,
    selectedNodeId,
    editorName,
    statusMessage,
    selectedNode,
    workflowJson,
    onFlowInit: store.onFlowInit,
    addActionNode: store.addActionNode,
    addConditionNode: store.addConditionNode,
    saveWorkflow: store.saveWorkflow,
    restoreWorkflow: store.restoreWorkflow,
    resetWorkflow: store.resetWorkflow,
    updateNodeData: store.updateNodeData,
    deleteNode: store.deleteNode,
  };
}
