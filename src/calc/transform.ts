import { argError } from "../errors.ts";
import { Circle, GObject, Line, Point } from "../objects.ts";
import { interLL, isParallel } from "./basic.ts";

export function reflectIn(X: Point, P: Point): Point;
export function reflectIn(X: Line, P: Point): Line;
export function reflectIn(X: Circle, P: Point): Circle;
export function reflectIn(X: Point, P: Line): Point;
export function reflectIn(X: Line, P: Line): Line;
export function reflectIn(X: Circle, P: Line): Circle;
export function reflectIn(X: GObject, Y: Point | Line) {
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
            let m = Y.B * Y.B + Y.A * Y.A;
            let n = Y.B * Y.B - Y.A * Y.A;
            return new Point(
                (X.x * n - 2 * Y.A * (Y.B * X.y + Y.C)) / m,
                (-X.y * n - 2 * Y.B * (Y.A * X.x + Y.C)) / m,
            );
        } else if (X instanceof Line) {
            if (isParallel(X, Y)) {
                return new Line(X.A, X.B, 2 * Y.C - X.C);
            } else {
                let A = Y.A;
                let B = Y.B;
                let C = X.A;
                let D = X.B;
                let A0 = A * A * C + 2 * A * B * D - B * B * C;
                let B0 = 2 * A * B * C + (B * B - A * A) * D;
                let inter = interLL(X, Y);
                return new Line(A0, B0, inter);
            }
        } else if (X instanceof Circle) {
            return new Circle(reflectIn(X.O, Y), X.r);
        }
    }
    throw argError("symmetry", [X, Y]);
}
