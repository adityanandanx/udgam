import { useKeyPress, useReactFlow } from "@xyflow/react";
import { useEffect, useLayoutEffect, useRef } from "react";
import useStore from "../store";

export function useIdeaNode(id: string, label: string, dragging: boolean) {
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
      inputRef.current.style.width = `${label.length * 8}px`;
    }
  }, [label.length]);

  const handleLabelChange = (newLabel: string) => {
    updateNodeLabel(id, newLabel);
  };

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  return {
    inputRef,
    handleLabelChange,
    handleDelete,
    dragging,
  };
}
