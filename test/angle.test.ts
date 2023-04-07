import { assert, assertAlmostEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { isOverlap } from "../src/calc/basic.ts";
import { ab, Circle, Line, o, p, rt } from "../src/index.ts";
import { angle, DEG, ROUND } from "../src/calc/angle.ts";
import { O, xx, yy } from "../src/objects.ts";

Deno.test({
    name: "angle",
    fn() {
        assertAlmostEquals(
            Math.PI / 4,
            angle(
                new Line(2, -1, 0),
                new Line(1, -3, 1),
            ),
        );
        assertAlmostEquals(
            Math.PI / 4,
            angle(
                new Line(1, 0, 0),
                new Line(1, -1, 1),
            ),
        );
        assertAlmostEquals(
            Math.PI / 4,
            angle(
                new Line(0, 1, 0),
                new Line(1, -1, 1),
            ),
        );
    },
});

Deno.test({
    name: "rotate",
    fn() {
        const O = p(1, 1);
        const A = p(2, 1 + Math.sqrt(3));
        const l = new Line(1, -2, 0);
        const c = new Circle(A, 2);
        const A0 = p(3, 1);
        const l0 = new Line(2, 1, -2);
        const c0 = o(p(3, 1), 2);
        assert(isOverlap(rt(A, O, -60 * DEG), A0));
        assert(isOverlap(rt(l, O, -0.25 * ROUND), l0));
        assert(isOverlap(rt(c, O, -Math.PI / 3), c0));
    },
});

Deno.test({
    name: "angle bisector",
    fn() {
        const A = p(1, 0);
        const B = p(0, 1);
        const C = p(0, -1);
        const D = p(-1, Math.sqrt(3));
        const l1 = new Line(1, -1, 0);
        const l2 = new Line(1, 1, 0);
        const l3 = new Line(Math.sqrt(3), -1, 0);
        assert(isOverlap(ab(xx, yy)[0], l2));
        assert(isOverlap(ab(A, O, B)[0], l1));
        assert(isOverlap(ab(A, O, B)[1], l2));
        assert(isOverlap(ab(B, O, A)[0], l1));
        assert(isOverlap(ab(B, O, A)[1], l2));
        assert(isOverlap(ab(A, O, C)[0], l2));
        assert(isOverlap(ab(A, O, C)[1], l1));
        assert(isOverlap(ab(A, O, D)[0], l3));
    },
});
