import {
  Edge,
  EdgeChange,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
  InternalNode,
} from "@xyflow/react";
import { create } from "zustand";
import { nanoid } from "nanoid/non-secure";
import { TIdeaNode } from "./types";

export type RFState = {
  nodes: TIdeaNode[];
  edges: Edge[];
  onNodesChange: OnNodesChange<TIdeaNode>;
  onEdgesChange: OnEdgesChange;
  updateNodeLabel: (nodeId: string, label: string) => void;
  addChildNode: (parentNode: InternalNode, position: XYPosition) => void;
  arrangeNodesHorizontally: () => void;
};

const useStore = create<RFState>((set, get) => ({
  nodes: [
    {
      id: "root",
      type: "mindmap",
      data: { label: "React Flow Mind Map" },
      position: { x: 0, y: 0 },
      dragHandle: ".dragHandle",
    },
  ],
  edges: [],
  onNodesChange: (changes: NodeChange<TIdeaNode>[]) => {
    set({
      nodes: applyNodeChanges<TIdeaNode>(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  updateNodeLabel: (nodeId: string, label: string) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          // it's important to create a new node here, to inform React Flow about the changes
          return {
            ...node,
            data: { ...node.data, label },
          };
        }

        return node;
      }),
    });
  },
  addChildNode: (parentNode: InternalNode, position: XYPosition) => {
    const newNode: TIdeaNode = {
      id: nanoid(),
      type: "mindmap",
      data: { label: "New Node" },
      position,
      dragHandle: ".dragHandle",
      parentId: parentNode.id,
    };

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
    };

    set({
      nodes: [...get().nodes, newNode],
      edges: [...get().edges, newEdge],
    });
  },
  arrangeNodesHorizontally: () => {
    const { nodes, edges } = get();
    const rootNode = nodes.find((node) => node.id === "root");
    if (!rootNode) return;

    const HORIZONTAL_GAP = 300;
    const VERTICAL_GAP = 100;

    // Build parent -> children map
    const childrenMap = new Map<string, string[]>();
    nodes.forEach((node) => childrenMap.set(node.id, []));
    edges.forEach((edge) => {
      const list = childrenMap.get(edge.source) || [];
      list.push(edge.target);
      childrenMap.set(edge.source, list);
    });

    const positions = new Map<string, { x: number; y: number }>();
    positions.set("root", { x: 0, y: 0 });

    const rootChildren = childrenMap.get("root") || [];

    let currentY = 0;
    rootChildren.forEach((id) => {
      const x = HORIZONTAL_GAP;
      const y = currentY;
      positions.set(id, { x, y });
      layoutSubtree(id, x, y);
      currentY += VERTICAL_GAP;
    });

    function layoutSubtree(nodeId: string, parentX: number, startY: number) {
      const children = childrenMap.get(nodeId) || [];
      let currentY = startY;
      children.forEach((childId) => {
        const x = parentX + HORIZONTAL_GAP;
        const y = currentY;
        positions.set(childId, { x, y });
        layoutSubtree(childId, x, y);
        currentY += VERTICAL_GAP;
      });
    }

    // Apply updated positions
    const newNodes = nodes.map((node) => {
      const pos = positions.get(node.id);
      return pos ? { ...node, position: pos } : node;
    });

    set({ nodes: newNodes });
  },
}));

export default useStore;
