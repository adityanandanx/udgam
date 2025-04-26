import { useUpdateIdea } from "@/hooks/api-hooks/use-ideas";
import useBlockNavigation from "@/hooks/use-block-navigation";
import { IdeaResponse } from "@/lib/api/ideas";
import {
  InternalNode,
  OnConnectStartParams,
  useKeyPress,
  useReactFlow,
  useStoreApi,
} from "@xyflow/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import useStore, { RFState } from "../store";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  arrangeNodesHorizontally: state.arrangeNodesHorizontally,
  getCurrentState: state.getCurrentState,
  initializeWithData: state.initializeWithData,
});

export function useIdeaFlow(idea: IdeaResponse) {
  const store = useStoreApi();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addChildNode,
    arrangeNodesHorizontally,
    getCurrentState,
    initializeWithData,
  } = useStore(useShallow(selector));

  const { screenToFlowPosition } = useReactFlow();
  const connectingNodeId = useRef<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const ctrlS = useKeyPress(["Control+s", "Meta+s", "Strg+s"]);

  // Save with hotkey
  useEffect(() => {
    if (ctrlS) {
      console.log("SAVEEEE");

      handleSave();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctrlS]);

  // Compare current state with original data to detect changes
  useEffect(() => {
    if (!idea || !nodes.length) return;

    // Deep comparison check to determine if there are unsaved changes
    const currentState = getCurrentState();
    const hasChanges =
      JSON.stringify(currentState.nodes) !== JSON.stringify(idea.nodes) ||
      JSON.stringify(currentState.edges) !== JSON.stringify(idea.edges);

    setHasUnsavedChanges(hasChanges);
  }, [nodes, edges, idea, getCurrentState]);

  const { isAttemptingNavigation, cancelNavigation, proceedNavigation } =
    useBlockNavigation(hasUnsavedChanges);

  const updateIdeaMutation = useUpdateIdea({
    onSuccess: () => {
      setIsSaving(false);
      setHasUnsavedChanges(false);
    },
    onError: () => {
      setIsSaving(false);
    },
  });

  // Initialize store with idea data
  useEffect(() => {
    if (idea && idea.nodes && idea.edges) {
      initializeWithData(idea.nodes, idea.edges);
    }
  }, [idea, initializeWithData]);

  const handleSave = () => {
    setIsSaving(true);
    const { nodes, edges } = getCurrentState();
    updateIdeaMutation.mutate({
      id: idea.id,
      data: {
        title: idea.title,
        short_desc: idea.short_desc,
        nodes,
        edges,
      },
    });
  };

  const onConnectStart = useCallback(
    (e: MouseEvent | TouchEvent, { nodeId }: OnConnectStartParams) => {
      // we need to remember where the connection started so we can add the new node to the correct parent on connect end
      connectingNodeId.current = nodeId;
    },
    []
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
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
    [store, screenToFlowPosition, addChildNode]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnectStart,
    onConnectEnd,
    arrangeNodesHorizontally,
    handleSave,
    isSaving,
    hasUnsavedChanges,
    isAttemptingNavigation,
    cancelNavigation,
    proceedNavigation,
  };
}
