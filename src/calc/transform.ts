import { argError } from "../errors.ts";
import { Circle, GObject, Line, Point } from "../objects.ts";
import {
    distanceSq,
    interLC,
    interLL,
    isOverlap,
    isParallel,
    isThrough,
    midpoint,
    perp,
    projection,
} from "./basic.ts";

/**
 * Reflect an object `X` in another object `Y`. When `Y` is a circle this means inversion.
 */
export function reflectIn(A: Point, P: Point): Point;
export function reflectIn(l: Line, P: Point): Line;
export function reflectIn(c: Circle, P: Point): Circle;
export function reflectIn(A: Point, k: Line): Point;
export function reflectIn(l: Line, k: Line): Line;
export function reflectIn(c: Circle, k: Line): Circle;
export function reflectIn(A: Point, c: Circle): Point;
export function reflectIn(x: Line | Circle, c: Circle): Line | Circle;
export function reflectIn(X: GObject, Y: GObject) {
    if (Y instanceof Point) {
        if (X instanceof Point) {
            return new Point(2 * Y.x - X.x, 2 * Y.y - X.y);
        } else if (X instanceof Line) {
            return new Line(X.A, X.B, -X.C - 2 * (X.A * Y.x + X.B * Y.y));
        } else if (X instanceof Circle) {
            return new Circle(reflectIn(X.O, Y), X.r);
        }
    } else if (Y instanceof Line) {
        if (X instanceof Point) {
            const m = Y.B * Y.B + Y.A * Y.A;
            const n = Y.B * Y.B - Y.A * Y.A;
            return new Point(
                (X.x * n - 2 * Y.A * (Y.B * X.y + Y.C)) / m,
                (-X.y * n - 2 * Y.B * (Y.A * X.x + Y.C)) / m,
            );
        } else if (X instanceof Line) {
            if (isParallel(X, Y)) {
                return new Line(X.A, X.B, 2 * Y.C - X.C);
            } else {
                const A = Y.A;
                const B = Y.B;
                const C = X.A;
                const D = X.B;
                const A0 = A * A * C + 2 * A * B * D - B * B * C;
                const B0 = 2 * A * B * C + (B * B - A * A) * D;
                const inter = interLL(X, Y);
                return new Line(A0, B0, inter);
            }
        } else if (X instanceof Circle) {
            return new Circle(reflectIn(X.O, Y), X.r);
        }
    } else if (Y instanceof Circle) {
        return invert(X, Y.O, Y.r * Y.r);
    }
    throw argError("reflect", [X, Y]);
}

export function invert(A: Point, O: Point, p: number): Point;
export function invert(x: Line | Circle, O: Point, p: number): Line | Circle;
export function invert(A: GObject, O: Point, p: number): GObject;
export function invert(X: GObject, O: Point, p: number) {
    if (X instanceof Point) {
        if (isOverlap(X, O)) throw new Error("Inverting the center itself");
        const dx = X.x - O.x;
        const dy = X.y - O.y;
        const scale = p / distanceSq(X, O);
        return new Point(O.x + scale * dx, O.y + scale * dy);
    } else if (X instanceof Line) {
        if (isThrough(X, O)) return X;
        const P = projection(O, X);
        const O1 = midpoint(invert(P, O, p), O);
        return new Circle(O1, O);
    } else if (X instanceof Circle) {
        if (isThrough(X, O)) {
            const P = midpoint(invert(X.O, O, p), O);
            return perp(P, new Line(P, O));
        } else {
            const [A, B] = interLC(new Line(O, X.O), X);
            const A0 = invert(A, O, p);
            const B0 = invert(B, O, p);
            const O1 = midpoint(A0, B0);
            return new Circle(O1, A0);
        }
    }
    throw argError("invert", [X, O, p]);
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
