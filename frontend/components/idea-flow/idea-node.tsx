import { cn } from "@/lib/utils";
import { Handle, NodeProps, Position } from "@xyflow/react";
import { GripVerticalIcon, XIcon } from "lucide-react";
import { BaseNode } from "../base-node";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useIdeaNode } from "./hooks/use-idea-node";
import { type TIdeaNode } from "./types";

export function IdeaNode({
  id,
  data,
  dragging,
  selected,
}: NodeProps<TIdeaNode>) {
  const { inputRef, handleLabelChange, handleDelete } = useIdeaNode(
    id,
    data.label,
    dragging
  );

  return (
    <BaseNode className="min-w-[256px] relative p-0 group">
      <div
        className={cn(
          "absolute -z-10 bottom-full right-0 group-hover:-translate-y-0 group-hover:opacity-100 -translate-x-0 transition-transform translate-y-full opacity-50",
          {
            "translate-y-1/2": selected,
            hidden: id === "root",
          }
        )}
      >
        <Button
          size={"icon"}
          variant={"outline"}
          className="size-4"
          aria-label="delete node"
          onClick={handleDelete}
        >
          <XIcon size={12} className="size-3" />
        </Button>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="dragHandle px-2">
          <GripVerticalIcon className="text-muted-foreground" size={16} />
        </div>
        <Input
          disabled={dragging}
          value={data.label}
          onChange={(evt) => handleLabelChange(evt.target.value)}
          className="flex-1 px-1 py-1"
          ref={inputRef}
        />
      </div>

      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 10, height: 20, borderRadius: 2 }}
      />
      <Handle type="target" position={Position.Left} />
    </BaseNode>
  );
}
