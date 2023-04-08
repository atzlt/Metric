import { assert, assertAlmostEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { center, distance, inter, isCollinear, isOverlap, isParallel } from "../src/calc/basic.ts";
import { onCircle } from "../src/calc/point_on.ts";
import {
    circumcenter,
    fromBarycentric,
    incenter,
    orthocenter,
    symmedian,
} from "../src/calc/advanced/triangle/center.ts";
import { circle, line, point } from "../src/objects.ts";

Deno.test({
    name: "Reim's Thm.",
    fn() {
        const c1 = circle(point(2, 1), 3);
        const c2 = circle(point(-3, 0), 4);
        const [A, B] = inter(c1, c2);
        const C = onCircle(c1, Math.PI * 2 / 3);
        const D = onCircle(c1, Math.PI);
        const [E] = inter(line(C, A), c2, A);
        const [F] = inter(line(D, B), c2, B);
        assert(isParallel(line(E, F), line(C, D)));
    },
});

Deno.test({
    name: "Euler line",
    fn() {
        const A = point(1, 3);
        const B = point(-2.3, 7.2);
        const C = point(0.5, 8.2);
        const O = circumcenter([A, B, C]);
        const H = orthocenter([A, B, C]);
        const G = center(A, B, C);
        assert(isCollinear(O, H, G));
    },
});

Deno.test({
    name: "Incenter",
    fn() {
        const A = point(1, 3);
        const B = point(-2.3, 7.2);
        const C = point(0.5, 8.2);
        const I = incenter([A, B, C]);
        const d = distance(I, line(A, B));
        const e = distance(I, line(C, B));
        const f = distance(I, line(A, C));
        assertAlmostEquals(d, e);
        assertAlmostEquals(e, f);
    },
});

Deno.test({
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
        assert(isOverlap(K, K0));
    },
});
