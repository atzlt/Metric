import { argError } from "../errors.ts";
import {
    Circle,
    GObject,
    isCircle,
    isLine,
    isPoint,
    Line,
    line,
    Point,
    point,
} from "../objects.ts";

const EPSILON = 1e-10;
export const DEG = Math.PI / 180;
export const ROUND = 2 * Math.PI;

/**
 * Whether two numbers are approximately equal. This is used to prevent exceptions
 * caused by precision loss in floating-point calculations.
 */
function aprxEq(a: number, b: number) {
    return Math.abs(a - b) <= EPSILON;
}

/**
 * Determine whether the two lines are parallel.
 */
export function isParallel(l: Line, k: Line) {
    if (aprxEq(l[0] * k[1], k[0] * l[1])) return true;
    else return false;
}

/**
 * Determine whether a line or circle passes through a point.
 */
export function isThrough(x: Line | Circle, P: Point) {
    if (isLine(x)) {
        return aprxEq(x[0] * P[0] + x[1] * P[1] + x[2], 0);
    } else if (isCircle(x)) {
        return aprxEq(distanceSq(P, x[0]), x[1] * x[1]);
    }
}

function isProportional(x: number, y: number, s: number, t: number) {
    return aprxEq(x * t, y * s);
}

/**
 * Determines whether the three points are collinear.
 */
export function isCollinear(A: Point, B: Point, C: Point) {
    return isProportional(A[0] - B[0], A[1] - B[1], A[0] - C[0], A[1] - C[1]);
}

export function isOverlap(X: Point, Y: Point): boolean;
export function isOverlap(X: Line, Y: Line): boolean;
export function isOverlap(X: Circle, Y: Circle): boolean;
export function isOverlap(X: GObject, Y: GObject) {
    if (isPoint(X) && isPoint(Y)) {
        return aprxEq(X[0], Y[0]) && aprxEq(X[1], Y[1]);
    } else if (isLine(X) && isLine(Y)) {
        return isProportional(X[0], X[1], Y[0], Y[1]) &&
            isProportional(X[1], X[2], Y[1], Y[2]);
    } else if (isCircle(X) && isCircle(Y)) {
        return isOverlap(X[0], Y[0]) && aprxEq(X[1], Y[1]);
    }
    throw argError("checking overlap", [X, Y]);
}

/**
 * Find the intersection of two lines. If there are none (i.e. they're parallel) throw an error.
 * @returns The intersection of two lines.
 */
export function interLL(l: Line, k: Line): Point {
    if (isParallel(l, k)) {
        throw new Error(
            "Parallel lines has no intersections: computing inter " +
                l.toString() + " and " +
                k.toString(),
        );
    }
    const a = l[1] * k[2] - k[1] * l[2];
    const b = l[2] * k[0] - k[2] * l[0];
    const d = l[0] * k[1] - k[0] * l[1];
    return point(a / d, b / d);
}

/**
 * Find the intersections of a line and a circle.
 * @returns The list of intersections. If there are none, returns an empty list `[]`.
 */
export function interLC(l: Line, c: Circle, common?: Point): Point[] {
    const O = c[0];
    const r = c[1];
    if (l[0] != 0) {
        const ya = l[0] * l[0] + l[1] * l[1];
        const yb = 2 * ((l[0] * O[0] + l[2]) * l[1] - l[0] * l[0] * O[1]);
        if (common) {
            const y2 = -yb / ya - common[1];
            return [point(-(l[1] * y2 + l[2]) / l[0], y2)];
        } else {
            const yc = l[0] * l[0] * (O[1] * O[1] - r * r) +
                (l[0] * O[0] + l[2]) * (l[0] * O[0] + l[2]);
            let D = yb * yb - 4 * ya * yc;
            if (D < 0) return [];
            D = Math.sqrt(D);
            const y1 = (-yb + D) / ya / 2;
            const y2 = (-yb - D) / ya / 2;
            return [
                point(-(l[1] * y1 + l[2]) / l[0], y1),
                point(-(l[1] * y2 + l[2]) / l[0], y2),
            ];
        }
    } else {
        const xa = l[1] * l[1];
        const xb = 2 * -l[1] * l[1] * O[0];
        if (common) {
            const x2 = -xb / xa - common[0];
            return [point(x2, -l[2] / l[1])];
        } else {
            const xc = l[1] * l[1] * (O[0] * O[0] - r * r) +
                (l[1] * O[1] + l[2]) * (l[1] * O[1] + l[2]);
            let D = xb * xb - 4 * xa * xc;
            if (D < 0) return [];
            D = Math.sqrt(D);
            const x1 = (-xb + D) / xa / 2;
            const x2 = (-xb - D) / xa / 2;
            return [
                point(x1, -l[2] / l[1]),
                point(x2, -l[2] / l[1]),
            ];
        }
    }
}

/**
 * Find the radical axis of two circles.
 * @returns The radical axis.
 */
export function radicalAxis(c: Circle, d: Circle) {
    const D1 = -2 * c[0][0];
    const E1 = -2 * c[0][1];
    const F1 = c[0][0] * c[0][0] + c[0][1] * c[0][1] - c[1] * c[1];
    const D2 = -2 * d[0][0];
    const E2 = -2 * d[0][1];
    const F2 = d[0][0] * d[0][0] + d[0][1] * d[0][1] - d[1] * d[1];
    return line(D1 - D2, E1 - E2, F1 - F2);
}

/**
 * Find the intersections of two circles.
 * @returns The list of intersections. If there are none, returns an empty list `[]`.
 */
export function interCC(c: Circle, d: Circle, common?: Point) {
    return interLC(radicalAxis(c, d), c, common);
}

export function inter(X: Line, Y: Line): Point;
export function inter(X: Line, Y: Circle, common?: Point): Point[];
export function inter(X: Circle, Y: Line, common?: Point): Point[];
export function inter(X: Circle, Y: Circle, common?: Point): Point[];
export function inter(X: Line | Circle, Y: Line | Circle, common?: Point) {
    if (isLine(X)) {
        if (isLine(Y)) return interLL(X, Y);
        if (isCircle(Y)) return interLC(X, Y, common);
    } else if (isCircle(X)) {
        if (isLine(Y)) return interLC(Y, X, common);
        if (isCircle(Y)) return interCC(X, Y, common);
    }
}

/**
 * Find the square of the distance between two geometric objects.
 *
 * This function is overloaded. The arguments can be:
 *
 * 1. Point and Point;
 * 2. Point and Line, or Line and Point;
 * 3. Line and Line (they must be parallel, else throw an error).
 */
export function distanceSq(X: Point | Line, Y: Point | Line): number {
    if (isPoint(X) && isPoint(Y)) {
        return (X[0] - Y[0]) * (X[0] - Y[0]) + (X[1] - Y[1]) * (X[1] - Y[1]);
    } else if (isPoint(X) && isLine(Y)) {
        const z = X[0] * Y[0] + X[1] * Y[1] + Y[2];
        return z * z / (Y[0] * Y[0] + Y[1] * Y[1]);
    } else if (isLine(X) && isPoint(Y)) {
        return distanceSq(Y, X);
    } else if (isLine(X) && isLine(Y)) {
        if (!isParallel(X, Y)) {
            throw new Error(
                "Cannot compute distance between lines that are not parallel: " +
                    X.toString() + "and" +
                    Y.toString(),
            );
        }
        const z = X[2] - Y[2];
        return z * z / (X[0] * X[0] + X[1] * X[1]);
    }
    throw argError("squared distance", [X, Y]);
}

/**
 * Find the distance between two geometric objects.
 *
 * This function is overloaded. The arguments can be:
 *
 * 1. Point and Point;
 * 2. Point and Line, or Line and Point;
 * 3. Line and Line (they must be parallel, else throw an error).
 */
export function distance(X: Point | Line, Y: Point | Line) {
    return Math.sqrt(distanceSq(X, Y));
}

/**
 * Find the midpoint of two points.
 * @returns The midpoint.
 */
export function midpoint(A: Point, B: Point) {
    return point((A[0] + B[0]) / 2, (A[1] + B[1]) / 2);
}

function sum(x: number[]) {
    let s = 0;
    for (const i of x) s += i;
    return s;
}

function mean(x: number[]) {
    return sum(x) / x.length;
}

/**
 * Find the center (of gravity) of an array of points.
 * @returns The center.
 */
export function center(...P: Point[]) {
    const xs = P.map((p, _) => p[0]);
    const ys = P.map((p, _) => p[1]);
    return point(mean(xs), mean(ys));
}

/**
 * Construct a parallel line through a point.
 *
 * This function is overloaded. The arguments can be:
 *
 * 1. Point and Line;
 * 2. Line and Point.
 */
export function parallel(A: Point, l: Line): Line;
export function parallel(l: Line, A: Point): Line;
export function parallel(X: Point | Line, Y: Point | Line) {
    if (isPoint(X) && isLine(Y)) {
        return line(Y[0], Y[1], -(Y[0] * X[0] + Y[1] * X[1]));
    } else if (isLine(X) && isPoint(Y)) {
        return parallel(Y, X);
    }
    throw argError("parallel", [X, Y]);
}

/**
 * Construct a perpendicular line through a point.
 *
 * This function is overloaded. The arguments can be:
 *
 * 1. Point and Line;
 * 2. Line and Point.
 */
export function perp(A: Point, l: Line): Line;
export function perp(l: Line, A: Point): Line;
export function perp(X: Point | Line, Y: Point | Line) {
    if (isPoint(X) && isLine(Y)) {
        return line(-Y[1], Y[0], Y[1] * X[0] - Y[0] * X[1]);
    } else if (isLine(X) && isPoint(Y)) {
        return perp(Y, X);
    }
    throw argError("perpendicular", [X, Y]);
}

export function projection(A: Point, l: Line) {
    const n = l[0] * l[0] + l[1] * l[1];
    return point(
        (l[1] * l[1] * A[0] - l[0] * l[2] - l[0] * l[1] * A[1]) / n,
        (l[0] * l[0] * A[1] - l[1] * l[2] - l[0] * l[1] * A[0]) / n,
    );
}

/**
 * Construct the perpendicular bisector of two points.
 * @returns The perpendicular bisector.
 */
export function perpBisect(A: Point, B: Point) {
    return perp(midpoint(A, B), line(A, B));
}

export function angleBisect(l: Line, k: Line): Line[];
export function angleBisect(A: Point, O: Point, B: Point): Line[];
export function angleBisect(...args: [Line, Line] | [Point, Point, Point]) {
    if (args.length == 2) {
        const [l, k] = args;
        const m = Math.sqrt(l[0] * l[0] + l[1] * l[1]);
        const n = Math.sqrt(k[0] * k[0] + k[1] * k[1]);
        const A = l[0] / m;
        const B = l[1] / m;
        const C = l[2] / m;
        const A0 = k[0] / n;
        const B0 = k[1] / n;
        const C0 = k[2] / n;
        return [
            line(A + A0, B + B0, C + C0),
            line(A - A0, B - B0, C - C0),
        ];
    } else if (args.length == 3) {
        const [A, O, B] = args;
        return angleBisect(line(O, A), line(O, B));
    }
    throw argError("angle bisector", args);
}

export function angle(l: Line, k: Line) {
    const a = l[0] * l[0] + l[1] * l[1];
    const b = k[0] * k[0] + k[1] * k[1];
    const p = (l[0] * k[0] + l[1] * k[1]) / Math.sqrt(a * b);
    return Math.acos(Math.abs(p));
}
