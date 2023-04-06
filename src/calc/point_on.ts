import { Circle, Point } from "../objects.ts";

/**
 * Define a point on circle by an angle (starts from the direction of the x-axis, rotates
 * counter-clockwise).
 *
 * @param c The circle.
 * @param angle The angle, _in radians_.
 */
export function onCircle(c: Circle, angle: number) {
    return new Point(
        c.O.x + c.r * Math.cos(angle),
        c.O.y + c.r * Math.sin(angle),
    );
}

/**
 * Define a point on a segment by location; that is, if `P = onSegment([A, B], r)`, then
 * `vec(PA) / vec(PB) = r`.
 */
export function onSegment([A, B]: Point[], r: number) {
    return new Point(
        r * B.x + (1 - r) * A.x,
        r * B.y + (1 - r) * A.y,
    );
}
