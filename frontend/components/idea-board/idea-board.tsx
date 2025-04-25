"use client";
import React from "react";
import { useDraw } from "./hooks/use-draw";
import IdeaNode from "./idea-node";

export const IdeaBoard = () => {
  const { canvasRef, canvasProps } = useDraw();
  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded-lg"
        {...canvasProps}
      />
      <div className="absolute left-0 top-0">
        <IdeaNode id={1} text="Parent Idea 1">
          <IdeaNode id={2} text="Child Idea 1">
            <IdeaNode id={3} text="Grandchild Idea 1" />
            <IdeaNode id={4} text="Grandchild Idea 2" />
          </IdeaNode>
          <IdeaNode id={5} text="Child Idea 2">
            <IdeaNode id={6} text="Grandchild Idea 3" />
            <IdeaNode id={7} text="Grandchild Idea 4">
              <IdeaNode id={8} text="Great Grandchild Idea 1" />
            </IdeaNode>
          </IdeaNode>
        </IdeaNode>
      </div>
    </div>
  );
};
