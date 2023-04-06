import { assert, assertAlmostEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import {
    center,
    distance,
    interCC,
    interLC,
    interLL,
    isCollinear,
    isOverlap,
    isParallel,
    perp,
    perpBisect,
} from "../src/calc/basic.ts";
import { onCircle } from "../src/calc/point_on.ts";
import { Circle, Line, Point } from "../src/objects.ts";
import { fromBarycentric, incenter, symmedian } from "../src/calc/advanced/triangle/center.ts";

Deno.test({
    name: "Reim's Thm.",
    fn() {
        const c1 = new Circle(new Point(2, 1), 3);
        const c2 = new Circle(new Point(-3, 0), 4);
        const [A, B] = interCC(c1, c2);
        const C = onCircle(c1, Math.PI * 2 / 3);
        const D = onCircle(c1, Math.PI);
        const [E] = interLC(new Line(C, A), c2, A);
        const [F] = interLC(new Line(D, B), c2, B);
        assert(isParallel(new Line(E, F), new Line(C, D)));
    },
});

Deno.test({
    name: "Euler line",
    fn() {
        const A = new Point(1, 3);
        const B = new Point(-2.3, 7.2);
        const C = new Point(0.5, 8.2);
        const O = interLL(perpBisect(A, B), perpBisect(B, C));
        const H = interLL(perp(A, new Line(B, C)), perp(B, new Line(A, C)));
        const G = center(A, B, C);
        assert(isCollinear(O, H, G));
    },
});

Deno.test({
    name: "Incenter",
    fn() {
        const A = new Point(1, 3);
        const B = new Point(-2.3, 7.2);
        const C = new Point(0.5, 8.2);
        const I = incenter([A, B, C]);
        const d = distance(I, new Line(A, B));
        const e = distance(I, new Line(C, B));
        const f = distance(I, new Line(A, C));
        assertAlmostEquals(d, e);
        assertAlmostEquals(e, f);
    }
})

Deno.test({
    name: "Symmedian Barycentric",
    fn() {
        const A = new Point(1, 3);
        const B = new Point(-2.3, 7.2);
        const C = new Point(0.5, 8.2);
        const a = distance(B, C);
        const b = distance(A, C);
        const c = distance(B, A);
        const K = symmedian([A, B, C]);
        const K0 = fromBarycentric([A, B, C], [a * a, b * b, c * c]);
        assert(isOverlap(K, K0));
    }
})
