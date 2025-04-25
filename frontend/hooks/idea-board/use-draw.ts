import { MouseEvent, RefObject, useEffect, useRef } from "react";
import { Node } from "./graph";

class Grid {
  constructor(public size: number) {}

  draw(
    ctx: CanvasRenderingContext2D,
    origin: Vector2,
    width: number,
    height: number,
    scale: number
  ) {
    ctx.fillStyle = "rgba(255, 255, 255, .5)";
    ctx.lineWidth = 1;

    // Adjust grid size based on scale
    const adjustedSize = this.size / scale;

    const dotSize = Math.max(1, 2 / scale);

    // Calculate grid starting point adjusted by scale
    const startX = origin.x % adjustedSize;
    const startY = origin.y % adjustedSize;

    for (let i = startX; i < width / scale; i += adjustedSize) {
      for (let j = startY; j < height / scale; j += adjustedSize) {
        ctx.beginPath();
        ctx.fillRect(i, j, dotSize, dotSize);
        ctx.stroke();
        ctx.closePath();
      }
    }

    // Draw origin marker
    ctx.beginPath();
    ctx.arc(0, 0, 5 / scale, 0, Math.PI * 4);
    ctx.fill();
    ctx.closePath();
  }
}

class Vector2 {
  constructor(public x: number, public y: number) {}
}

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
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = canvasRef.current.clientWidth;
    canvasRef.current.height = canvasRef.current.clientHeight;
    let canvasRect = canvasRef.current.getBoundingClientRect();
    let reqId: number;
    const origin = new Vector2(canvasRect.width / 2, canvasRect.height / 2);
    const grid = new Grid(30);

    const render = () => {
      const { width, height } = canvasRect;
      const { x: rawMx, y: rawMy } = mousePosition.current;
      const { x: scrollDeltaX, y: scrollDeltaY } = scrollDelta.current;

      ctx.resetTransform();

      // Adjust scroll speed based on scale - divide by scale to maintain consistent
      // feel regardless of zoom level
      origin.x -= scrollDeltaX / (10 * scale.current);
      origin.y -= scrollDeltaY / (10 * scale.current);

      const mx = rawMx - origin.x;
      const my = rawMy - origin.y;

      ctx.beginPath();
      ctx.rect(0, 0, width, height);
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();

      // Apply scale transformation
      ctx.scale(scale.current, scale.current);

      // Adjust origin for the current scale
      const scaledOriginX = origin.x / scale.current;
      const scaledOriginY = origin.y / scale.current;

      // Pass scaled origin to grid drawing
      grid.draw(
        ctx,
        new Vector2(scaledOriginX, scaledOriginY),
        width,
        height,
        scale.current
      );

      // Translate to center of canvas adjusted for scale
      ctx.translate(scaledOriginX, scaledOriginY);

      ctx.beginPath();
      ctx.rect(
        mx / scale.current,
        my / scale.current,
        10 / scale.current,
        10 / scale.current
      );
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.closePath();

      rootNode.current.drawAll(ctx);

      reqId = requestAnimationFrame(render);

      scrollDelta.current.x = 0;
      scrollDelta.current.y = 0;
    };

    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = canvasRef.current.clientWidth;
      canvasRef.current.height = canvasRef.current.clientHeight;
      canvasRect = canvasRef.current.getBoundingClientRect();
    };

    render();

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mousePosition, scrollDelta, scale]);

  const canvasProps: React.HTMLProps<HTMLCanvasElement> = {
    ...controlsCanvasProps,
  };

  return { canvasRef, canvasProps };
};

const useControls = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
  const scrollDelta = useRef<Vector2>({ x: 0, y: 0 });
  const mousePosition = useRef<Vector2>({ x: 0, y: 0 });
  const scale = useRef<number>(1);
  const isDragging = useRef<boolean>(false);
  const lastMousePosition = useRef<Vector2>({ x: 0, y: 0 });
  // Store the origin position for zoom calculations
  const origin = useRef<Vector2>({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize origin position to center of canvas
    if (canvas.clientWidth && canvas.clientHeight) {
      origin.current = {
        x: canvas.clientWidth / 2,
        y: canvas.clientHeight / 2,
      };
    }

    const handleWheel = (e: globalThis.WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey) {
        // Zoom centered on mouse position
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate cursor position relative to current origin
        const cursorXFromOrigin = mouseX - origin.current.x;
        const cursorYFromOrigin = mouseY - origin.current.y;

        // Store old scale for calculation
        const oldScale = scale.current;

        // Update scale based on wheel delta
        scale.current -= e.deltaY / 1000;
        scale.current = Math.max(0.1, Math.min(10, scale.current));

        // Calculate scale factor
        const scaleFactor = scale.current / oldScale;

        // Adjust the origin to zoom toward cursor
        origin.current.x = mouseX - cursorXFromOrigin * scaleFactor;
        origin.current.y = mouseY - cursorYFromOrigin * scaleFactor;

        // Update scroll delta to reflect the change in origin
        scrollDelta.current.x -=
          (origin.current.x - mouseX + cursorXFromOrigin) * 10;
        scrollDelta.current.y -=
          (origin.current.y - mouseY + cursorYFromOrigin) * 10;
      } else {
        // Regular scroll
        scrollDelta.current.x += e.deltaX;
        scrollDelta.current.y += e.deltaY;
      }
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });

    // Clean up event listener on unmount
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [canvasRef]);

  // Update origin when dragging
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Initialize origin position when canvas is ready
    origin.current = {
      x: canvas.clientWidth / 2,
      y: canvas.clientHeight / 2,
    };

    return () => {};
  }, [
    canvasRef.current?.clientWidth,
    canvasRef.current?.clientHeight,
    canvasRef,
  ]);

  const canvasProps: React.HTMLProps<HTMLCanvasElement> = {
    onMouseDown: (e: React.MouseEvent) => {
      if (e.buttons === 4 || e.button === 1) {
        // Middle mouse button
        isDragging.current = true;
        lastMousePosition.current = {
          x: e.clientX,
          y: e.clientY,
        };
        // Change cursor to indicate dragging
        if (canvasRef.current) {
          canvasRef.current.style.cursor = "grabbing";
        }
      }
    },

    onMouseUp: () => {
      isDragging.current = false;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "default";
      }
    },

    onMouseMove: (e: MouseEvent) => {
      if (!canvasRef.current) return;

      const { left, top } = canvasRef.current.getBoundingClientRect();
      mousePosition.current.x = e.clientX - left;
      mousePosition.current.y = e.clientY - top;

      // Improved middle-mouse button drag handling with scale consideration
      if (isDragging.current || e.buttons & 4) {
        const deltaX = e.clientX - lastMousePosition.current.x;
        const deltaY = e.clientY - lastMousePosition.current.y;

        // Scale drag sensitivity consistently based on zoom level
        // Multiply by scale to keep drag feeling consistent at different zoom levels
        scrollDelta.current.x -= deltaX * 7 * scale.current;
        scrollDelta.current.y -= deltaY * 7 * scale.current;

        // Update origin reference based on drag
        origin.current.x += deltaX;
        origin.current.y += deltaY;

        lastMousePosition.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }
    },

    onMouseLeave: () => {
      isDragging.current = false;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "default";
      }
    },

    style: {
      cursor: isDragging.current ? "grabbing" : "default",
    },
  };

  return { canvasProps, scrollDelta, mousePosition, scale };
};
