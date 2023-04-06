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
            y0 * c + x0 * s + O.y,
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

export function angleBisect(l: Line, k: Line): Line[];
export function angleBisect(A: Point, O: Point, B: Point): Line[];
export function angleBisect(...args: (Point | Line)[]) {
    if (args.length == 2) {
        const [l, k] = <Line[]>args;
        const m = Math.sqrt(l.A * l.A + l.B * l.B);
        const n = Math.sqrt(k.A * k.A + k.B * k.B);
        const A = l.A / m;
        const B = l.B / m;
        const C = l.C / m;
        const A0 = k.A / n;
        const B0 = k.B / n;
        const C0 = k.C / n;
        return [new Line(A + A0, B + B0, C + C0), new Line(A - A0, B - B0, C - C0)];
    } else if (args.length == 3) {
        const [A, O, B] = <Point[]>args;
        return angleBisect(new Line(O, A), new Line(O, B));
    }
    throw argError("angle bisector", args);
}
