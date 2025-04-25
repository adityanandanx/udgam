/**
 * Interface representing a 2D vector
 */
export interface Vector2 {
  x: number;
  y: number;
}

/**
 * Creates a new Vector2 object
 */
export const createVector2 = (x: number, y: number): Vector2 => ({ x, y });
