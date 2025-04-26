import {
  Handle,
  NodeProps,
  Position,
  useKeyPress,
  useReactFlow,
} from "@xyflow/react";
import { GripVerticalIcon, Trash2Icon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { BaseNode } from "../base-node";
import { Input } from "../ui/input";
import useStore from "./store";
import { type IdeaNode } from "./types";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export function IdeaNode({
  id,
  data,
  dragging,
  selected,
}: NodeProps<IdeaNode>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const deleteBtnPressed = useKeyPress("Delete");
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const { deleteElements } = useReactFlow();

  useEffect(() => {
    if (deleteBtnPressed && inputRef.current !== document.activeElement) {
      deleteElements({ nodes: [{ id }] });
    }
  }, [deleteBtnPressed, deleteElements, id]);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 1);
  }, []);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${data.label.length * 8}px`;
    }
  }, [data.label.length]);

  return (
    <BaseNode className="min-w-[256px] relative p-0 group">
      <div
        className={cn(
          "absolute -z-10 top-full right-0 group-hover:translate-y-1 -translate-x-1 transition-transform -translate-y-full",
          {
            "-translate-y-1/2": selected,
            hidden: id === "root",
          }
        )}
      >
        <Button
          size={"icon"}
          variant={"destructive"}
          className="size-6"
          aria-label="delete node"
          onClick={() => {
            deleteElements({ nodes: [{ id }] });
          }}
        >
          <Trash2Icon size={16} />
        </Button>
      </div>
      <div className="flex w-full items-center justify-center">
        <div className="dragHandle px-2">
          <GripVerticalIcon className="text-muted-foreground" size={16} />
        </div>
        <Input
          disabled={dragging}
          value={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
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
