import { assert, assertAlmostEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { DEG, ROUND, angle, rotate } from "../src/calc/angle.ts";
import { Circle, Line, Point } from "../src/objects.ts";
import { isOverlap } from "../src/calc/basic.ts";

Deno.test({
    name: "angle",
    fn() {
        assertAlmostEquals(Math.PI / 4, angle(
            new Line(2, -1, 0),
            new Line(1, -3, 1),
        ));
        assertAlmostEquals(Math.PI / 4, angle(
            new Line(1, 0, 0),
            new Line(1, -1, 1),
        ));
        assertAlmostEquals(Math.PI / 4, angle(
            new Line(0, 1, 0),
            new Line(1, -1, 1),
        ));
    }
});

Deno.test({
    name: "rotate",
    fn() {
        const O = new Point(1, 1);
        const A = new Point(2, 1 + Math.sqrt(3));
        const l = new Line(1, -2, 0);
        const c = new Circle(A, 2);
        const A0 = new Point(3, 1);
        const l0 = new Line(2, 1, -2);
        const c0 = new Circle(new Point(3, 1), 2);
        assert(isOverlap(rotate(A, O, -60 * DEG), A0));
        assert(isOverlap(rotate(l, O, -0.25 * ROUND), l0));
        assert(isOverlap(rotate(c, O, -Math.PI / 3), c0));
    }
})
