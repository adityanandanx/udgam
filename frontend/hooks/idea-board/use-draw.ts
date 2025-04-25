import { useEffect, useRef } from "react";
import { Node } from "./graph";
import { Grid } from "./utils/Grid";
import { createVector2 } from "./utils/Vector2";
import { GRID_SIZE, RED_SQUARE_SIZE } from "./utils/constants";
import { useControls } from "./use-controls";

/**
 * Main hook for canvas drawing and interaction
 */
export const useDraw = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rootNode = useRef<Node>(Node.createSampleNodes());
  const {
    mousePosition,
    scrollDelta,
    scale,
    canvasProps: controlsCanvasProps,
  } = useControls(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    let canvasRect = canvas.getBoundingClientRect();
    const origin = createVector2(canvasRect.width / 2, canvasRect.height / 2);
    const grid = new Grid(GRID_SIZE);

    let animationFrameId: number;

    const render = () => {
      const { width, height } = canvasRect;
      const { x: rawMx, y: rawMy } = mousePosition.current;
      const { x: scrollDeltaX, y: scrollDeltaY } = scrollDelta.current;
      const currentScale = scale.current;

      ctx.resetTransform();

      // Adjust scroll speed based on scale to maintain consistent feel
      origin.x -= scrollDeltaX / (10 * currentScale);
      origin.y -= scrollDeltaY / (10 * currentScale);

      const mx = rawMx - origin.x;
      const my = rawMy - origin.y;

      // Clear canvas with black background
      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();

      // Apply scale transformation
      ctx.scale(currentScale, currentScale);

      // Adjust origin for the current scale
      const scaledOriginX = origin.x / currentScale;
      const scaledOriginY = origin.y / currentScale;

      // Pass scaled origin to grid drawing
      grid.draw(
        ctx,
        createVector2(scaledOriginX, scaledOriginY),
        width,
        height,
        currentScale
      );

      // Translate to center of canvas adjusted for scale
      ctx.translate(scaledOriginX, scaledOriginY);

      // Draw red square at mouse position
      ctx.beginPath();
      const squareSize = RED_SQUARE_SIZE / currentScale;
      ctx.rect(mx / currentScale, my / currentScale, squareSize, squareSize);
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();

      // Draw the node graph
      rootNode.current.drawAll(ctx);

      // Reset scroll delta after rendering
      scrollDelta.current.x = 0;
      scrollDelta.current.y = 0;

      // Schedule next frame
      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      canvasRect = canvas.getBoundingClientRect();
    };

    // Start rendering loop
    render();

    // Set up resize handler
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mousePosition, scrollDelta, scale]);

  const canvasProps: React.HTMLProps<HTMLCanvasElement> = {
    ...controlsCanvasProps,
  };

  return { canvasRef, canvasProps };
};
