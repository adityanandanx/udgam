import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  DefaultEdgeOptions,
  InternalNode,
  NodeOrigin,
  OnConnectEnd,
  OnConnectStart,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  useStoreApi,
} from "@xyflow/react";
import { useCallback, useRef } from "react";
import { useShallow } from "zustand/react/shallow";

import useStore, { RFState } from "./store";

// we need to import the React Flow styles to make it work
import { IdeaResponse } from "@/lib/api/ideas";
import "@xyflow/react/dist/style.css";
import { Button } from "../ui/button";
import { IdeaEdge } from "./idea-edge";
import { IdeaNode } from "./idea-node";
import { TIdeaNode } from "./types";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  arrangeNodesHorizontally: state.arrangeNodesHorizontally,
});

const nodeTypes = {
  mindmap: IdeaNode,
};

const edgeTypes = {
  mindmap: IdeaEdge,
};

const nodeOrigin: NodeOrigin = [0, 0.5];

const connectionLineStyle: DefaultEdgeOptions["style"] = {
  stroke: "#8d8d8d",
  strokeWidth: 4,
};
const defaultEdgeOptions: DefaultEdgeOptions = {
  style: connectionLineStyle,
  type: "mindmap",
};

function Flow({ idea }: { idea: IdeaResponse }) {
  const store = useStoreApi();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addChildNode,
    arrangeNodesHorizontally,
  } = useStore(useShallow(selector));
  const { screenToFlowPosition } = useReactFlow();
  const connectingNodeId = useRef<string | null>(null);

  const getChildNodePosition = (
    event: MouseEvent | TouchEvent,
    parentNode?: InternalNode
  ) => {
    const { domNode } = store.getState();

    if (
      !domNode ||
      // we need to check if these properites exist, because when a node is not initialized yet,
      // it doesn't have a positionAbsolute nor a width or height
      !parentNode?.internals.positionAbsolute ||
      !parentNode?.measured.width ||
      !parentNode?.measured.height
    ) {
      return;
    }

    // we need to remove the wrapper bounds, in order to get the correct mouse position
    const panePosition = screenToFlowPosition({
      x: "clientX" in event ? event.clientX : event.touches[0].clientX,
      y: "clientY" in event ? event.clientY : event.touches[0].clientY,
    });

    // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
    return {
      x: panePosition.x - parentNode.internals.positionAbsolute.x,
      y: panePosition.y - parentNode.internals.positionAbsolute.y,
    };
  };

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    // we need to remember where the connection started so we can add the new node to the correct parent on connect end
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeLookup } = store.getState();
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane"
      );
      const node = (event.target as Element).closest(".react-flow__node");

      if (node) {
        node.querySelector("input")?.focus({ preventScroll: true });
      } else if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeLookup.get(connectingNodeId.current);

        if (parentNode) {
          const childNodePosition = getChildNodePosition(event, parentNode);

          if (childNodePosition) {
            addChildNode(parentNode, childNodePosition);
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getChildNodePosition]
  );

  return (
    <ReactFlow
      // nodes={nodes}
      // edges={edges}
      defaultNodes={idea.nodes}
      defaultEdges={idea.edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      nodeOrigin={nodeOrigin}
      defaultEdgeOptions={defaultEdgeOptions}
      connectionLineStyle={connectionLineStyle}
      connectionLineType={ConnectionLineType.Bezier}
      snapToGrid
      snapGrid={[32, 32]}
      fitView
      colorMode="dark"
    >
      <Background gap={32} variant={BackgroundVariant.Cross} />
      <Controls showInteractive={false} />
      <Panel position="top-center" className="">
        Nirbhay mind map
      </Panel>
      <Panel
        position="top-right"
        className="overflow-y-auto max-h-[80vh] bg-background/80 rounded-md p-10 text-xs"
      >
        <pre>{JSON.stringify(nodes, null, 2)}</pre>
      </Panel>
      <Panel position="bottom-center">
        <Button onClick={() => arrangeNodesHorizontally()}>Arrange</Button>
      </Panel>
    </ReactFlow>
  );
}

export const IdeaFlow = ({ idea }: { idea: IdeaResponse }) => {
  return (
    <ReactFlowProvider>
      <Flow idea={idea} />
    </ReactFlowProvider>
  );
};
