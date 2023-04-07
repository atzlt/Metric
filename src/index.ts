import { angleBisect, rotate } from "./calc/angle.ts";
import {
    distance,
    distanceSq,
    interCC,
    interLC,
    interLL,
    parallel,
    perp,
    perpBisect,
} from "./calc/basic.ts";
import * as calc from "./calc/mod.ts";
import { argError } from "./errors.ts";
import { Circle, Line, Point } from "./objects.ts";
import * as centers from "./calc/advanced/triangle/center.ts";
import { reflectIn } from "./calc/transform.ts";

function p(x: number, y: number) {
    return new Point(x, y);
}
function $(A: Point, B: Point, C: Point): Circle;
function $(A: Point, B: Point): Circle;
function $(...args: [Point, Point, Point] | [Point, Point]) {
    if (args.length == 2) return new Circle(...args);
    if (args.length == 3) return new Circle(...args);
    throw argError("shorthand $", args);
}
function o(O: Point, r: number): Circle;
function o(O: Point, A: Point): Circle;
function o(O: Point, X: Point | number) {
    if (typeof X == "number") return new Circle(O, X);
    if (X instanceof Point) return new Circle(O, X);
    throw argError("shorthand o", [O, X]);
}
function l(A: Point, B: Point) {
    return new Line(A, B);
}
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
const pa = parallel;
const pe = perp;
const pb = perpBisect;
const ab = angleBisect;
const rt = rotate;
const d = distance;
const d2 = distanceSq;
const refl = reflectIn;

export { $, ab, calc, centers, Circle, d, d2, i, l, Line, o, p, pa, pb, pe, Point, refl, rt };
