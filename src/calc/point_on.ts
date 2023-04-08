import { Circle, Point, point } from "../objects.ts";

/**
 * Define a point on circle by an angle (starts from the direction of the x-axis, rotates
 * counter-clockwise).
 *
 * @param c The circle.
 * @param angle The angle, _in radians_.
 */
export function onCircle(c: Circle, angle: number) {
    return point(
        c[0][0] + c[1] * Math.cos(angle),
        c[0][1] + c[1] * Math.sin(angle),
    );
}

/**
 * Define a point on a segment by location; that is, if `P = onSegment([A, B], r)`, then
 * `vec(PA) / vec(PB) = r`.
 */
export function onSegment([A, B]: Point[], r: number) {
    return point(
        r * B[0] + (1 - r) * A[0],
        r * B[1] + (1 - r) * A[1],
    );
}
