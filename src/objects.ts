import { distance, interLL, perpBisect } from "./calc/basic.ts";
import { argError } from "./errors.ts";

export class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return `(${this.x}, ${this.y})`;
    }
}

export const O = new Point(0, 0);

export class Line {
    A: number;
    B: number;
    C: number;
    constructor(A: number, B: number, C: number);
    constructor(A: number, B: number, thru: Point);
    constructor(A: Point, B: Point);
    // deno-lint-ignore no-explicit-any
    constructor(...args: any[]) {
        if (args.length == 3) {
            if (args[2] instanceof Point) {
                this.A = args[0];
                this.B = args[1];
                const x = args[2].x;
                const y = args[2].y;
                this.C = -this.A * x - this.B * y;
                return;
            } else if (typeof args[2] === "number") {
                this.A = args[0];
                this.B = args[1];
                this.C = args[2];
                return;
            }
        } else if (args.length == 2) {
            const A = args[0];
            const B = args[1];
            if (A.x == B.x && A.y == B.y) {
                throw new Error(
                    "Defining a line using only one distinct point",
                );
            }
            this.A = A.y - B.y;
            this.B = B.x - A.x;
            this.C = A.y * (A.x - B.x) - A.x * (A.y - B.y);
            return;
        }
        throw argError("constructing line", args);
    }

    toString() {
        const a = this.A == 0 ? "" : `${this.A == 1 ? "" : this.A}x + `;
        const b = this.B == 0 ? "" : `${this.B == 1 ? "" : this.B}y + `;
        const c = this.C == 0 ? "" : this.C.toString();
        return a + b + c + " = 0";
    }
}

export const xx = new Line(1, 0, 0);
export const yy = new Line(0, 1, 0);

export class Circle {
    O: Point;
    r: number;
    constructor(O: Point, r: number);
    constructor(O: Point, A: Point);
    constructor(A: Point, B: Point, C: Point);
    // deno-lint-ignore no-explicit-any
    constructor(...args: any[]) {
        if (args.length == 2) {
            if (typeof args[1] === "number") {
                this.O = args[0];
                this.r = args[1];
                return;
            } else if (args[1] instanceof Point) {
                this.O = args[0];
                this.r = distance(args[0], args[1]);
                return;
            }
        } else if (args.length == 3) {
            this.O = interLL(
                perpBisect(args[0], args[1]),
                perpBisect(args[1], args[2]),
            );
            this.r = distance(this.O, args[1]);
            return;
        }
        throw argError("constructing circle", args);
    }
}

export type GObject = Point | Line | Circle;
