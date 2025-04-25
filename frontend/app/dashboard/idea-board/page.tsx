"use client";
import { useDraw } from "@/hooks/idea-board/use-draw";

const IdeaBoardPage = () => {
  const { canvasRef, canvasProps } = useDraw();
  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" {...canvasProps} />
    </div>
  );
};

export default IdeaBoardPage;
