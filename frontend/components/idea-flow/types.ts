import { type Node } from "@xyflow/react";

export type NodeData = {
  label: string;
};

export type TIdeaNode = Node<NodeData, "mindmap">;
