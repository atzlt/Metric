import { line, Point, point } from "../../../objects.ts";
import {
    angleBisect,
    center,
    distanceSq,
    interLL,
    midpoint,
    perp,
    perpBisect,
} from "../../basic.ts";
import { reflectIn } from "../../transform.ts";
import { sideLength, Triangle } from "./basic.ts";

export function isogonalConjugate([A, B, C]: Triangle, P: Point) {
    const l1 = angleBisect(A, B, C)[0];
    const l2 = angleBisect(B, C, A)[0];
    const P1 = reflectIn(P, l1);
    const P2 = reflectIn(P, l2);
    return interLL(line(B, P1), line(C, P2));
}

/**
 * Returns a point from its barycentric coordinates, i.e. `x : y : z = S(BPC) : S(CPB) : S(BPA)`,
 * where `S(...)` denotes (signed) area.
 */
export function fromBarycentric(
    [A, B, C]: Triangle,
    [x, y, z]: [number, number, number],
) {
    const s = x + y + z;
    return point(
        (A[0] * x + B[0] * y + C[0] * z) / s,
        (A[1] * x + B[1] * y + C[1] * z) / s,
    );
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
    return interLL(perp(A, line(B, C)), perp(B, line(C, A)));
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
