import { distance, inter, perpBisect } from "./calc/basic.ts";
import { argError } from "./errors.ts";

export type Point = [number, number];

// deno-lint-ignore no-explicit-any
export function isPoint(x: any): x is Point {
    return x.length === 2 && typeof x[0] === "number" && typeof x[1] === "number";
}

export function point(x: number, y: number): Point {
    return [x, y];
}

export type Line = [number, number, number];

// deno-lint-ignore no-explicit-any
export function isLine(x: any): x is Line {
    return x.length === 3 &&
        typeof x[0] === "number" &&
        typeof x[1] === "number" &&
        typeof x[2] === "number";
}

export function line(A: number, B: number, C: number): Line;
export function line(A: number, B: number, thru: Point): Line;
export function line(A: Point, B: Point): Line;
export function line(...args: [number, number, number | Point] | [Point, Point]): Line {
    if (args.length == 3) {
        if (isPoint(args[2])) {
            return [args[0], args[1], -args[0] * args[2][0] - args[1] * args[2][1]];
        } else if (typeof args[2] === "number") {
            return args as Line;
        }
    } else if (args.length == 2) {
        const A = args[0];
        const B = args[1];
        if (A[0] == B[0] && A[1] == B[1]) {
            throw new Error(
                "Defining a line using only one distinct point",
            );
        }
        return [
            A[1] - B[1],
            B[0] - A[0],
            A[1] * (A[0] - B[0]) - A[0] * (A[1] - B[1]),
        ];
    }
    throw argError("constructing line", args);
}

export type Circle = [Point, number];

// deno-lint-ignore no-explicit-any
export function isCircle(x: any): x is Circle {
    return x.length === 2 && isPoint(x[0]) && typeof x[1] === "number";
}

export function circle(O: Point, r: number): Circle;
export function circle(O: Point, A: Point): Circle;
export function circle(A: Point, B: Point, C: Point): Circle;
export function circle(...args: [Point, number | Point] | [Point, Point, Point]): Circle {
    if (args.length == 2) {
        if (typeof args[1] === "number") {
            return args as Circle;
        } else if (isPoint(args[1])) {
            return [args[0], distance(args[0], args[1])];
        }
    } else if (args.length == 3) {
        const O = inter(
            perpBisect(args[0], args[1]),
            perpBisect(args[1], args[2]),
        );
        return [O, distance(O, args[1])];
    }
    throw argError("constructing circle", args);
}

export type GObject = Point | Line | Circle;
