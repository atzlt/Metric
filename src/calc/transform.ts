import { argError } from "../errors.ts";
import {
    Circle,
    circle,
    GObject,
    isCircle,
    isLine,
    isPoint,
    Line,
    line,
    Point,
    point,
} from "../objects.ts";
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
    if (isPoint(Y)) {
        if (isPoint(X)) {
            return point(2 * Y[0] - X[0], 2 * Y[1] - X[1]);
        } else if (isLine(X)) {
            return line(X[0], X[1], -X[2] - 2 * (X[0] * Y[0] + X[1] * Y[1]));
        } else if (isCircle(X)) {
            return circle(reflectIn(X[0], Y), X[1]);
        }
    } else if (isLine(Y)) {
        if (isPoint(X)) {
            const m = Y[1] * Y[1] + Y[0] * Y[0];
            const n = Y[1] * Y[1] - Y[0] * Y[0];
            return point(
                (X[0] * n - 2 * Y[0] * (Y[1] * X[1] + Y[2])) / m,
                (-X[1] * n - 2 * Y[1] * (Y[0] * X[0] + Y[2])) / m,
            );
        } else if (isLine(X)) {
            if (isParallel(X, Y)) {
                return line(X[0], X[1], 2 * Y[2] - X[2]);
            } else {
                const A = Y[0];
                const B = Y[1];
                const C = X[0];
                const D = X[1];
                const A0 = A * A * C + 2 * A * B * D - B * B * C;
                const B0 = 2 * A * B * C + (B * B - A * A) * D;
                const inter = interLL(X, Y);
                return line(A0, B0, inter);
            }
        } else if (isCircle(X)) {
            return circle(reflectIn(X[0], Y), X[1]);
        }
    } else if (isCircle(Y)) {
        return invert(X, Y[0], Y[1] * Y[1]);
    }
    throw argError("reflect", [X, Y]);
}

export function invert(A: Point, O: Point, p: number): Point;
export function invert(x: Line | Circle, O: Point, p: number): Line | Circle;
export function invert(A: GObject, O: Point, p: number): GObject;
export function invert(X: GObject, O: Point, p: number) {
    if (isPoint(X)) {
        if (isOverlap(X, O)) throw new Error("Inverting the center itself");
        const dx = X[0] - O[0];
        const dy = X[1] - O[1];
        const scale = p / distanceSq(X, O);
        return point(O[0] + scale * dx, O[1] + scale * dy);
    } else if (isLine(X)) {
        if (isThrough(X, O)) return X;
        const P = projection(O, X);
        const O1 = midpoint(invert(P, O, p), O);
        return circle(O1, O);
    } else if (isCircle(X)) {
        if (isThrough(X, O)) {
            const P = midpoint(invert(X[0], O, p), O);
            return perp(P, line(P, O));
        } else {
            const [A, B] = interLC(line(O, X[0]), X);
            const A0 = invert(A, O, p);
            const B0 = invert(B, O, p);
            const O1 = midpoint(A0, B0);
            return circle(O1, A0);
        }
    }
    throw argError("invert", [X, O, p]);
}

export function rotate(A: Point, O: Point, angle: number): Point;
export function rotate(l: Line, O: Point, angle: number): Line;
export function rotate(c: Circle, O: Point, angle: number): Circle;
export function rotate(X: GObject, O: Point, angle: number) {
    if (isPoint(X)) {
        const x0 = X[0] - O[0];
        const y0 = X[1] - O[1];
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return point(
            x0 * c - y0 * s + O[0],
            y0 * c + x0 * s + O[1],
        );
    } else if (isCircle(X)) {
        return circle(rotate(X[0], O, angle), X[1]);
    } else if (isLine(X)) {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        const A0 = X[0] * c - X[1] * s;
        const B0 = X[1] * c + X[0] * s;
        const C = X[0] * O[0] + X[1] * O[1] + X[2];
        return line(A0, B0, C - O[0] * A0 - O[1] * B0);
    }
    throw argError("rotate", [X, O, angle]);
}

export function scale(A: Point, O: Point, r: number): Point;
export function scale(A: Line, O: Point, r: number): Line;
export function scale(A: Circle, O: Point, r: number): Circle;
export function scale(X: GObject, O: Point, r: number) {
    if (isPoint(X)) {
        return point(
            r * X[0] - (r - 1) * O[0],
            r * X[1] - (r - 1) * O[1],
        );
    } else if (isLine(X)) {
        return line(
            X[0],
            X[1],
            X[0] * (r - 1) * O[0] + X[1] * (r - 1) * O[1] + X[2] * r,
        );
    } else if (isCircle(X)) {
        return circle(scale(X[0], O, r), r * X[1]);
    }
}
