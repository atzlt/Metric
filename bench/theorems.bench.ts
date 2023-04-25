// deno-lint-ignore-file no-unused-vars

import {
    center,
    DEG,
    distance,
    inter,
    interLC,
    interLL,
    tangent,
} from "../src/calc/basic.ts";
import { onCircle } from "../src/calc/point_on.ts";
import {
    circumcenter,
    fromBarycentric,
    incenter,
    orthocenter,
    symmedian,
} from "../src/calc/advanced/triangle/center.ts";
import { circle, line, point } from "../src/objects.ts";

Deno.bench({ name: "prepare", fn() {} });
Deno.bench({ name: "noop-baseline", baseline: true, fn() {} });

Deno.bench({
    name: "Reim's Thm.",
    fn() {
        const c1 = circle(point(2, 1), 3);
        const c2 = circle(point(-3, 0), 4);
        const [A, B] = inter(c1, c2);
        const C = onCircle(c1, Math.PI * 2 / 3);
        const D = onCircle(c1, Math.PI);
        const [E] = inter(line(C, A), c2, A);
        const [F] = inter(line(D, B), c2, B);
    },
});

Deno.bench({
    name: "Euler line",
    fn() {
        const A = point(1, 3);
        const B = point(-2.3, 7.2);
        const C = point(0.5, 8.2);
        const O = circumcenter([A, B, C]);
        const H = orthocenter([A, B, C]);
        const G = center(A, B, C);
    },
});

Deno.bench({
    name: "Incenter",
    fn() {
        const A = point(1, 3);
        const B = point(-2.3, 7.2);
        const C = point(0.5, 8.2);
        const I = incenter([A, B, C]);
        const d = distance(I, line(A, B));
        const e = distance(I, line(C, B));
        const f = distance(I, line(A, C));
    },
});

Deno.bench({
    name: "Symmedian Barycentric",
    fn() {
        const A = point(1, 3);
        const B = point(-2.3, 7.2);
        const C = point(0.5, 8.2);
        const a = distance(B, C);
        const b = distance(A, C);
        const c = distance(B, A);
        const K = symmedian([A, B, C]);
        const K0 = fromBarycentric([A, B, C], [a * a, b * b, c * c]);
    },
});

Deno.bench({
    name: "Harmonic Quadrilateral",
    fn() {
        const c = circle(point(0, 0), 1);
        const A = onCircle(c, 0);
        const B = onCircle(c, 62 * DEG);
        const C = onCircle(c, 118 * DEG);
        const T = interLL(tangent(A, c)[0], tangent(C, c)[0]);
        const D = interLC(line(T, B), c, B)[0];
        const x = distance(A, B) * distance(C, D);
        const y = distance(B, C) * distance(D, A);
    },
});
