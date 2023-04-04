import { argError } from "../errors.ts";
import { Circle, GObject, Line, Point } from "../objects.ts";

const EPSILON = 1e-10;

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
    if (aprxEq(l.A * k.B, k.A * l.B)) return true;
    else return false;
}

/**
 * Determine whether a line or circle passes through a point.
 */
export function isThrough(x: Line | Circle, P: Point) {
    if (x instanceof Line) {
        return aprxEq(x.A * P.x + x.B * P.y + x.C, 0);
    } else if (x instanceof Circle) {
        return aprxEq(distanceSq(P, x.O), x.r * x.r);
    }
}

/**
 * Determines whether the three points are collinear.
 */
export function isCollinear(A: Point, B: Point, C: Point) {
    return aprxEq((A.x - B.x) * (A.y - C.y), (A.y - B.y) * (A.x - C.x));
}

/**
 * Find the intersection of two lines. If there are none (i.e. they're parallel) throw an error.
 * @returns The intersection of two lines.
 */
export function interLL(l: Line, k: Line) {
    if (isParallel(l, k))
        throw new Error(
            "Parallel lines has no intersections: computing interLL " +
            l.toString() + " and " +
            k.toString()
        );
    const a = l.B * k.C - k.B * l.C;
    const b = l.C * k.A - k.C * l.A;
    const d = l.A * k.B - k.A * l.B;
    return new Point(a / d, b / d);
}

/**
 * Find the intersections of a line and a circle.
 * @returns The list of intersections. If there are none, returns an empty list `[]`.
 */
export function interLC(l: Line, c: Circle, common?: Point) {
    const O = c.O;
    const r = c.r;
    if (l.A != 0) {
        const ya = l.A * l.A + l.B * l.B;
        const yb = 2 * ((l.A * O.x + l.C) * l.B - l.A * l.A * O.y);
        if (common) {
            const y2 = -yb / ya - common.y;
            return [new Point(-(l.B * y2 + l.C) / l.A, y2)];
        } else {
            const yc =
                l.A * l.A * (O.y * O.y - r * r) +
                (l.A * O.x + l.C) * (l.A * O.x + l.C);
            let D = yb * yb - 4 * ya * yc;
            if (D < 0) return [];
            D = Math.sqrt(D);
            const y1 = (-yb + D) / ya / 2;
            const y2 = (-yb - D) / ya / 2;
            return [
                new Point(-(l.B * y1 + l.C) / l.A, y1),
                new Point(-(l.B * y2 + l.C) / l.A, y2),
            ];
        }
    } else {
        const xa = l.B * l.B;
        const xb = 2 * - l.B * l.B * O.x;
        if (common) {
            const x2 = -xb / xa - common.x;
            return [new Point(x2, -l.C / l.B)];
        } else {
            const xc =
                l.B * l.B * (O.x * O.x - r * r) +
                (l.B * O.y + l.C) * (l.B * O.y + l.C);
            let D = xb * xb - 4 * xa * xc;
            if (D < 0) return [];
            D = Math.sqrt(D);
            const x1 = (-xb + D) / xa / 2;
            const x2 = (-xb - D) / xa / 2;
            return [
                new Point(x1, -l.C / l.B),
                new Point(x2, -l.C / l.B),
            ];
        }
    }
}

/**
 * Find the radical axis of two circles.
 * @returns The radical axis.
 */
export function radicalAxis(c: Circle, d: Circle) {
    const D1 = -2 * c.O.x;
    const E1 = -2 * c.O.y;
    const F1 = c.O.x * c.O.x + c.O.y * c.O.y - c.r * c.r;
    const D2 = -2 * d.O.x;
    const E2 = -2 * d.O.y;
    const F2 = d.O.x * d.O.x + d.O.y * d.O.y - d.r * d.r;
    return new Line(D1 - D2, E1 - E2, F1 - F2);
}

/**
 * Find the intersections of two circles.
 * @returns The list of intersections. If there are none, returns an empty list `[]`.
 */
export function interCC(c: Circle, d: Circle, common?: Point) {
    return interLC(radicalAxis(c, d), c, common);
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
    if (X instanceof Point && Y instanceof Point) {
        return (X.x - Y.x) * (X.x - Y.x) + (X.y - Y.y) * (X.y - Y.y);
    } else if (X instanceof Point && Y instanceof Line) {
        const z = (X.x * Y.A + X.y * Y.B + Y.C);
        return z * z / (Y.A * Y.A + Y.B * Y.B);
    } else if (X instanceof Line && Y instanceof Point) {
        return distanceSq(Y, X);
    } else if (X instanceof Line && Y instanceof Line) {
        if (!isParallel(X, Y))
            throw new Error(
                "Cannot compute distance between lines that are not parallel: " +
                X.toString() + "and" +
                Y.toString()
            );
        const z = X.C - Y.C;
        return z * z / (X.A * X.A + X.B * X.B);
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
    return new Point((A.x + B.x) / 2, (A.y + B.y) / 2);
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
export function center(P: Point[]) {
    const xs = P.map((p, _) => p.x);
    const ys = P.map((p, _) => p.y);
    return new Point(mean(xs), mean(ys));
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
export function parallel(X: GObject, Y: GObject) {
    if (X instanceof Point && Y instanceof Line) {
        return new Line(Y.A, Y.B, -(Y.A * X.x + Y.B * X.y));
    } else if (X instanceof Line && Y instanceof Point) {
        return parallel(Y, X);
    } else throw argError("parallel", [X, Y]);
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
export function perp(X: GObject, Y: GObject) {
    if (X instanceof Point && Y instanceof Line) {
        return new Line(-Y.B, Y.A, Y.B * X.x - Y.A * X.y);
    } else if (X instanceof Line && Y instanceof Point) {
        return parallel(Y, X);
    } else throw argError("parallel", [X, Y]);
}

export function projection(A: Point, l: Line) {
    return interLL(perp(A, l), l);
}

/**
 * Construct the perpendicular bisector of two points.
 * @returns The perpendicular bisector.
 */
export function perp_bisect(A: Point, B: Point) {
    return perp(midpoint(A, B), new Line(A, B));
}
