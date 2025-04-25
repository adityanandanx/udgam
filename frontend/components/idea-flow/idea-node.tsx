import { Handle, NodeProps, Position } from "@xyflow/react";
import { GripVerticalIcon } from "lucide-react";
import { useEffect, useLayoutEffect, useRef } from "react";
import { BaseNode } from "../base-node";
import { Input } from "../ui/input";
import useStore from "./store";
import { type IdeaNode } from "./types";

export function IdeaNode({ id, data, dragging }: NodeProps<IdeaNode>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);

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
    <BaseNode className="min-w-[256px] p-0">
      <div className="flex gap-2 w-full items-center justify-center pl-2">
        <div className="dragHandle">
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
