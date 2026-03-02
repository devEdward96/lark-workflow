import type { Edge, Node } from '@vue-flow/core';
import type { SavedWorkflowState, WorkflowNodeData } from '~/types/workflow';

const STORAGE_KEY = 'workflow-editor-state-v1';

type RestoreWorkflowResult =
  | {
      success: true;
      state: SavedWorkflowState;
      message: string;
    }
  | {
      success: false;
      message: string;
    };

export function saveWorkflowState(
  editorName: string,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): string {
  if (!import.meta.client) {
    return 'Save is only available in the browser.';
  }

  const payload: SavedWorkflowState = {
    editorName,
    nodes,
    edges,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return `Saved workflow (${nodes.length} nodes, ${edges.length} edges).`;
}

export function restoreWorkflowState(): RestoreWorkflowResult {
  if (!import.meta.client) {
    return {
      success: false,
      message: 'Restore is only available in the browser.',
    };
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return {
      success: false,
      message: 'No saved workflow found in local storage.',
    };
  }

  try {
    const parsed = JSON.parse(raw) as SavedWorkflowState;
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return {
        success: false,
        message: 'Saved workflow is invalid and could not be restored.',
      };
    }

    return {
      success: true,
      state: parsed,
      message: `Restored workflow (${parsed.nodes.length} nodes, ${parsed.edges.length} edges).`,
    };
  } catch {
    return {
      success: false,
      message: 'Saved workflow is corrupted and could not be restored.',
    };
  }
}

export function hasSavedWorkflowState(): boolean {
  if (!import.meta.client) {
    return false;
  }

  return Boolean(localStorage.getItem(STORAGE_KEY));
}
