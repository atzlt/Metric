import {
    assertAlmostEquals,
    assertEquals,
} from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { onCircle, onSegment } from "../src/calc/point_on.ts";
import { Circle, Point } from "../src/objects.ts";

Deno.test({
    name: "onCircle",
    fn() {
        const pi = Math.PI;
        const A = new Point(3, 3 + Math.sqrt(3));
        const c = new Circle(new Point(2, 3), 2);
        const A0 = onCircle(c, pi / 3);
        assertAlmostEquals(A.x, A0.x);
        assertAlmostEquals(A.y, A0.y);
    },
});

Deno.test({
    name: "onSegment",
    fn() {
        assertEquals(onSegment([new Point(0, 1), new Point(1, 0)], 5).x, 5);
        assertEquals(onSegment([new Point(0, 1), new Point(1, 0)], -1.5).y, 2.5);
    },
});
