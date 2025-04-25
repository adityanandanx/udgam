import { Vector2 } from "./Vector2";
import { ORIGIN_MARKER_SIZE } from "./constants";

/**
 * Class for drawing a grid in the canvas
 */
export class Grid {
  constructor(public size: number) {}

  /**
   * Draws the grid on the canvas context
   */
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
    ctx.arc(0, 0, ORIGIN_MARKER_SIZE / scale, 0, Math.PI * 4);
    ctx.fill();
    ctx.closePath();
  }
}
