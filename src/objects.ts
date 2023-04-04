import { distanceSq, interLL, perp_bisect } from "./calc/basic.ts";
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

export class Line {
    A: number;
    B: number;
    C: number;
    constructor(A: number, B: number, C: number);
    constructor(A: number, B: number, thru: Point);
    constructor(A: Point, B: Point);
    constructor(...args: any[]) {
        if (args.length == 3) {
            if (args[2] instanceof Point) {
                this.A = args[0];
                this.B = args[1];
                let x = args[2].x;
                let y = args[2].y;
                this.C = -this.A * x - this.B * y;
                return;
            } else if (typeof args[2] === "number") {
                this.A = args[0];
                this.B = args[1];
                this.C = args[2];
                return;
            }
        } else if (args.length == 2) {
            let A = args[0];
            let B = args[1];
            if (A.x == B.x && A.y == B.y)
                throw new Error(
                    "Defining a line using only one distinct point"
                );
            this.A = A.y - B.y;
            this.B = B.x - A.x;
            this.C = A.y * (A.x - B.x) - A.x * (A.y - B.y);
            return;
        };
        throw argError("constructing line", args);
    }

    toString() {
        let a = this.A == 0 ? "" : `${this.A}x + `;
        let b = this.B == 0 ? "" : `${this.B}y + `;
        let c = this.C == 0 ? "" : this.C.toString();
        return a + b + c + " = 0";
    }
}

export class Circle {
    O: Point;
    r: number;
    constructor(O: Point, r: number);
    constructor(O: Point, A: Point);
    constructor(A: Point, B: Point, C: Point);
    constructor(...args: any[]) {
        if (args.length == 2) {
            if (typeof args[1] === "number") {
                this.O = args[0];
                this.r = args[1];
                return;
            } else if (args[1] instanceof Point) {
                this.O = args[0];
                this.r = distanceSq(args[0], args[1]);
                return;
            }
        } else if (args.length == 3) {
            this.O = interLL(
                perp_bisect(args[0], args[1]),
                perp_bisect(args[1], args[2])
            );
            this.r = distanceSq(this.O, args[1]);
            return;
        };
        throw argError("constructing circle", args);
    }
}

export type GObject = Point | Line | Circle;
