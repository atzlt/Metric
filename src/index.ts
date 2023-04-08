import {
    angle,
    angleBisect,
    distance,
    distanceSq,
    interCC,
    interLC,
    interLL,
    parallel,
    perp,
    perpBisect,
} from "./calc/basic.ts";
import { onCircle, onSegment } from "./calc/point_on.ts";
import { argError } from "./errors.ts";
import { Circle, Line, Point } from "./objects.ts";
import { reflectIn, rotate } from "./calc/transform.ts";
export * as calc from "./calc/mod.ts";
export * as centers from "./calc/advanced/triangle/center.ts";

/**
 * Shorthand for `new Point`.
 */
function p(x: number, y: number) {
    return new Point(x, y);
}
/**
 * Shorthand for `new Circle(Point, Point, Point?)`.
 */
function $(A: Point, B: Point, C: Point): Circle;
function $(A: Point, B: Point): Circle;
function $(...args: [Point, Point, Point] | [Point, Point]) {
    if (args.length == 2) return new Circle(...args);
    if (args.length == 3) return new Circle(...args);
    throw argError("shorthand $", args);
}
/**
 * Shorthand for `new Circle(Point, Point)` and `new Circle(Point, number)`.
 */
function o(O: Point, r: number): Circle;
function o(O: Point, A: Point): Circle;
function o(O: Point, X: Point | number) {
    if (typeof X == "number") return new Circle(O, X);
    if (X instanceof Point) return new Circle(O, X);
    throw argError("shorthand o", [O, X]);
}
/**
 * Shorthand for `new Line(Point, Point)`.
 */
function l(A: Point, B: Point) {
    return new Line(A, B);
}
/**
 * Shorthand for `interLL`, `interLC` and `interCC`.
 */
function i(A: Line, B: Line): Point;
function i(A: Line, B: Circle, common?: Point): Point[];
function i(A: Circle, B: Line, common?: Point): Point[];
function i(A: Circle, B: Circle, common?: Point): Point[];
function i(A: Line | Circle, B: Line | Circle, common?: Point) {
    if (A instanceof Line) {
        if (B instanceof Line) return interLL(A, B);
        if (B instanceof Circle) return interLC(A, B, common);
    } else if (A instanceof Circle) {
        if (B instanceof Line) return interLC(B, A, common);
        if (B instanceof Circle) return interCC(A, B, common);
    }
    throw argError("shorthand i", [A, B]);
}
/** Shorthand for `calc.basic.parallel`. */
const pa = parallel;
/** Shorthand for `calc.basic.perp`. */
const pe = perp;
/** Shorthand for `calc.basic.perpBisect`. */
const pb = perpBisect;
/** Shorthand for `calc.angle.angleBisect`. */
const ab = angleBisect;
/** Shorthand for `calc.transform.rotate`. */
const rt = rotate;
/** Shorthand for `calc.basic.distance`. */
const d = distance;
/** Shorthand for `calc.basic.distanceSq`. */
const d2 = distanceSq;
/** Shorthand for `calc.basic.angle`. */
const ang = angle;
/** Shorthand for `calc.transform.refl`. */
const refl = reflectIn;

const DEG = Math.PI / 180;
const ROUND = 2 * Math.PI;

export {
    $,
    ab,
    ang,
    Circle,
    d,
    d2,
    DEG,
    i,
    l,
    Line,
    o,
    onCircle,
    onSegment,
    p,
    pa,
    pb,
    pe,
    Point,
    refl,
    ROUND,
    rt,
};
