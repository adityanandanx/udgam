import {
  Background,
  BackgroundVariant,
  ConnectionLineType,
  Controls,
  DefaultEdgeOptions,
  NodeOrigin,
  Panel,
  ReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";

// we need to import the React Flow styles to make it work
import { IdeaResponse } from "@/lib/api/ideas";
import "@xyflow/react/dist/style.css";
import { Loader2, LucideListTree, SaveIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useIdeaFlow } from "./hooks/use-idea-flow";
import { IdeaEdge } from "./idea-edge";
import { IdeaNode } from "./idea-node";

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
  const {
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
  } = useIdeaFlow(idea);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
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
        <Panel position="top-center" className="flex flex-col items-center">
          <span>
            {idea.title}
            {hasUnsavedChanges ? "*" : ""}
          </span>
          <span className="text-xs">
            {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
          </span>
        </Panel>
        <Panel position="top-right" className="flex gap-2 items-center">
          <Button
            variant={"secondary"}
            onClick={() => arrangeNodesHorizontally()}
          >
            <LucideListTree />
            Arrange
          </Button>
          <Button
            variant={"secondary"}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <SaveIcon /> Save
              </>
            )}
          </Button>
        </Panel>
        {/* <DebugPanel /> */}
      </ReactFlow>
      <AlertDialog
        open={isAttemptingNavigation}
        onOpenChange={cancelNavigation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="py-0 border-none">
              Unsaved Changes
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-0">
              You have unsaved changes that will be lost if you leave this page.
              Do you want to save your changes before continuing?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction asChild onClick={proceedNavigation}>
              <Button variant={"destructive"}>Leave Without Saving</Button>
            </AlertDialogAction>
            <AlertDialogCancel>Stay on Page</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const IdeaFlow = ({ idea }: { idea: IdeaResponse }) => {
  return (
    <ReactFlowProvider>
      <Flow idea={idea} />
    </ReactFlowProvider>
  );
};
