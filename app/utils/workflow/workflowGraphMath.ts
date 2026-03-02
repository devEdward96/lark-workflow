import type { Edge, Node } from '@vue-flow/core';
import { WorkflowNodeKind, type Point, type WorkflowNodeData } from '~/types/workflow';

const NODE_WIDTH = 400;
const NODE_HEIGHT = 90;
const EDGE_DROP_THRESHOLD = 70;

function getNodeOutputPoint(
  node: Node<WorkflowNodeData>,
  sourceHandle?: string,
): Point {
  const centerX = node.position.x + NODE_WIDTH / 2;
  const bottomY = node.position.y + NODE_HEIGHT;

  if (node.data?.kind === WorkflowNodeKind.Condition) {
    if (sourceHandle === 'yes') {
      return { x: node.position.x + NODE_WIDTH * 0.3, y: bottomY };
    }

    if (sourceHandle === 'no') {
      return { x: node.position.x + NODE_WIDTH * 0.7, y: bottomY };
    }
  }

  return { x: centerX, y: bottomY };
}

function getNodeInputPoint(node: Node<WorkflowNodeData>): Point {
  return {
    x: node.position.x + NODE_WIDTH / 2,
    y: node.position.y,
  };
}

function pointToSegmentDistance(
  point: Point,
  segmentStart: Point,
  segmentEnd: Point,
): number {
  const dx = segmentEnd.x - segmentStart.x;
  const dy = segmentEnd.y - segmentStart.y;
  const lengthSq = dx * dx + dy * dy;

  if (lengthSq === 0) {
    return Math.hypot(point.x - segmentStart.x, point.y - segmentStart.y);
  }

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - segmentStart.x) * dx + (point.y - segmentStart.y) * dy) /
        lengthSq,
    ),
  );
  const projectedX = segmentStart.x + t * dx;
  const projectedY = segmentStart.y + t * dy;
  return Math.hypot(point.x - projectedX, point.y - projectedY);
}

export function findClosestEdge(
  flowPoint: Point,
  nodes: Node<WorkflowNodeData>[],
  edges: Edge[],
): Edge | undefined {
  let nearestEdge: Edge | undefined;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const edge of edges) {
    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);
    if (!sourceNode || !targetNode) {
      continue;
    }

    const start = getNodeOutputPoint(sourceNode, edge.sourceHandle ?? undefined);
    const end = getNodeInputPoint(targetNode);
    const distance = pointToSegmentDistance(flowPoint, start, end);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestEdge = edge;
    }
  }

  if (nearestDistance > EDGE_DROP_THRESHOLD) {
    return undefined;
  }

  return nearestEdge;
}
