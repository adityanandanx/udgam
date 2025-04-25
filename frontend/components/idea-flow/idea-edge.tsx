import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";

export function IdeaEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: props.sourcePosition,
    targetPosition: props.targetPosition,
  });

  return <BaseEdge path={edgePath} style={props.style} />;
}
