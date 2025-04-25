import { MouseEvent, RefObject, useEffect, useRef } from "react";
import { Vector2, createVector2 } from "../utils/Vector2";
import {
  DRAG_SENSITIVITY,
  MAX_SCALE,
  MIN_SCALE,
  SCALE_CHANGE_RATE,
  SCROLL_SMOOTHING,
} from "../utils/constants";

/**
 * Hook to handle canvas controls like zooming, panning, and mouse interaction
 */
export const useControls = (canvasRef: RefObject<HTMLCanvasElement | null>) => {
  // References for tracking state
  const scrollDelta = useRef<Vector2>(createVector2(0, 0));
  const mousePosition = useRef<Vector2>(createVector2(0, 0));
  const scale = useRef<number>(1);
  const isDragging = useRef<boolean>(false);
  const lastMousePosition = useRef<Vector2>(createVector2(0, 0));
  const origin = useRef<Vector2>(createVector2(0, 0));

  // Set up wheel event handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize origin position to center of canvas
    if (canvas.clientWidth && canvas.clientHeight) {
      origin.current = createVector2(
        canvas.clientWidth / 2,
        canvas.clientHeight / 2
      );
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey) {
        handleZoom(e, canvas);
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

  // Handle zoom towards cursor position
  const handleZoom = (e: WheelEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate cursor position relative to current origin
    const cursorXFromOrigin = mouseX - origin.current.x;
    const cursorYFromOrigin = mouseY - origin.current.y;

    // Store old scale for calculation
    const oldScale = scale.current;

    // Update scale based on wheel delta
    scale.current -= e.deltaY / SCALE_CHANGE_RATE;
    scale.current = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.current));

    // Calculate scale factor
    const scaleFactor = scale.current / oldScale;

    // Adjust the origin to zoom toward cursor
    origin.current.x = mouseX - cursorXFromOrigin * scaleFactor;
    origin.current.y = mouseY - cursorYFromOrigin * scaleFactor;

    // Update scroll delta to reflect the change in origin
    scrollDelta.current.x -=
      (origin.current.x - mouseX + cursorXFromOrigin) * SCROLL_SMOOTHING;
    scrollDelta.current.y -=
      (origin.current.y - mouseY + cursorYFromOrigin) * SCROLL_SMOOTHING;
  };

  // Initialize/update origin when canvas size changes
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Initialize origin position when canvas is ready
    origin.current = createVector2(
      canvas.clientWidth / 2,
      canvas.clientHeight / 2
    );
  }, [
    canvasRef.current?.clientWidth,
    canvasRef.current?.clientHeight,
    canvasRef,
  ]);

  // Canvas event props
  const canvasProps: React.HTMLProps<HTMLCanvasElement> = {
    onMouseDown: (e: React.MouseEvent) => {
      if (e.buttons === 4 || e.button === 1) {
        // Middle mouse button
        isDragging.current = true;
        lastMousePosition.current = createVector2(e.clientX, e.clientY);

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
      mousePosition.current = createVector2(e.clientX - left, e.clientY - top);

      // Handle drag if middle mouse button is pressed
      if (isDragging.current || e.buttons & 4) {
        const deltaX = e.clientX - lastMousePosition.current.x;
        const deltaY = e.clientY - lastMousePosition.current.y;

        // Scale drag sensitivity based on zoom level
        scrollDelta.current.x -= deltaX * DRAG_SENSITIVITY * scale.current;
        scrollDelta.current.y -= deltaY * DRAG_SENSITIVITY * scale.current;

        // Update origin reference based on drag
        origin.current.x += deltaX;
        origin.current.y += deltaY;

        // Update last mouse position
        lastMousePosition.current = createVector2(e.clientX, e.clientY);
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
