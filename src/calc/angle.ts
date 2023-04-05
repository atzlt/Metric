import { Circle, GObject, Line, Point } from "../objects.ts";
import { argError } from "../errors.ts";

export const DEG = Math.PI / 180;
export const ROUND = 2 * Math.PI;

/**
 * Return the angle between two lines (the one in `[0, pi / 2]`) _in radians_.
 */
export function angle(l: Line, k: Line) {
    const a = l.A * l.A + l.B * l.B;
    const b = k.A * k.A + k.B * k.B;
    const p = (l.A * k.A + l.B * k.B) / Math.sqrt(a * b);
    return Math.acos(Math.abs(p));
}

export function rotate(A: Point, O: Point, angle: number): Point;
export function rotate(l: Line, O: Point, angle: number): Line;
export function rotate(c: Circle, O: Point, angle: number): Circle;
export function rotate(X: GObject, O: Point, angle: number) {
    if (X instanceof Point) {
        const x0 = X.x - O.x;
        const y0 = X.y - O.y;
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return new Point(
            x0 * c - y0 * s + O.y,
            y0 * c + x0 * s + O.y
        );
    } else if (X instanceof Circle) {
        return new Circle(rotate(X.O, O, angle), X.r);
    } else if (X instanceof Line) {
        const s = -Math.sin(angle);
        const c = Math.cos(angle);
        const A0 = X.A * c + X.B * s;
        const B0 = X.B * c - X.A * s;
        const C = X.A * O.x + X.B * O.y + X.C;
        return new Line(A0, B0, C - O.x * A0 - O.y * B0);
    }
    throw argError("rotate", [X, O, angle]);
}
