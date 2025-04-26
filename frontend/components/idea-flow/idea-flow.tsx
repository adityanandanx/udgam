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
import { Loader2 } from "lucide-react";
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
import DebugPanel from "./debug-panel";
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
        <Panel position="top-center" className="">
          {idea.title}
        </Panel>
        <Panel position="bottom-center" className="flex gap-2">
          <Button onClick={() => arrangeNodesHorizontally()}>Arrange</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
          {hasUnsavedChanges ? "Unsaved changes" : "All changes saved"}
        </Panel>
        <DebugPanel />
      </ReactFlow>
      <AlertDialog
        open={isAttemptingNavigation}
        onOpenChange={cancelNavigation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes that will be lost if you leave this page.
              Do you want to save your changes before continuing?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay on Page</AlertDialogCancel>
            <AlertDialogAction asChild onClick={proceedNavigation}>
              <Button variant={"destructive"}>Leave Without Saving</Button>
            </AlertDialogAction>
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
