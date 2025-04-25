import { type Node } from "@xyflow/react";

export type NodeData = {
  label: string;
};

export type IdeaNode = Node<NodeData, "mindmap">;
