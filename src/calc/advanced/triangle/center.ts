import { Line, Point } from "../../../objects.ts";
import { angleBisect } from "../../angle.ts";
import { center, distanceSq, interLL, midpoint, perp, perpBisect } from "../../basic.ts";
import { onSegment } from "../../point_on.ts";
import { reflectIn } from "../../transform.ts";
import { Triangle, sideLength } from "./basic.ts";

export function isogonalConjugate([A, B, C]: Triangle, P: Point) {
    const l1 = angleBisect(A, B, C)[0];
    const l2 = angleBisect(B, C, A)[0];
    const P1 = reflectIn(P, l1);
    const P2 = reflectIn(P, l2);
    return interLL(new Line(B, P1), new Line(C, P2));
}

/**
 * Returns a point from its barycentric coordinates, i.e. `x : y : z = S(BPC) : S(CPB) : S(BPA)`,
 * where `S(...)` denotes (signed) area.
 */
export function fromBarycentric([A, B, C]: Triangle, [x, y, z]: [number, number, number]) {
    if (y == 0 && z == 0) return A;
    else if (z == 0 && x == 0) return B;
    else if (x == 0 && y == 0) return C;
    else {
        const X = onSegment([B, C], z / (y + z));
        const Y = onSegment([C, A], x / (z + x));
        return interLL(new Line(A, X), new Line(B, Y));
    }
}

export function circumcenter([A, B, C]: Triangle) {
    return interLL(perpBisect(A, B), perpBisect(B, C));
}

export function incenter([A, B, C]: Triangle) {
    return interLL(angleBisect(A, B, C)[0], angleBisect(B, C, A)[0]);
}

/**
 * Returns the excenter **contained in the angle `BAC`**.
 */
export function excenter([A, B, C]: Triangle) {
    return interLL(angleBisect(B, A, C)[0], angleBisect(A, B, C)[1]);
}

export function orthocenter([A, B, C]: Triangle) {
    return interLL(perp(A, new Line(B, C)), perp(B, new Line(C, A)));
}

export function centroid([A, B, C]: Triangle) {
    return center(A, B, C);
}

export function ninePointCenter([A, B, C]: Triangle) {
    return midpoint(orthocenter([A, B, C]), circumcenter([A, B, C]));
}

export function symmedian([A, B, C]: Triangle) {
    const a2 = distanceSq(B, C);
    const b2 = distanceSq(C, A);
    const c2 = distanceSq(A, B);
    return fromBarycentric([A, B, C], [a2, b2, c2]);
}

export function gergonne(trig: Triangle) {
    const [a, b, c] = sideLength(trig);
    const p = (a + b + c) / 2;
    return fromBarycentric(trig, [p - a, p - b, p - c]);
}
