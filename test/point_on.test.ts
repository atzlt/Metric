import { assertAlmostEquals, assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { onCircle, onSegment } from "../src/calc/point_on.ts";
import { circle, point } from "../src/objects.ts";

Deno.test({
    name: "onCircle",
    fn() {
        const pi = Math.PI;
        const A = point(3, 3 + Math.sqrt(3));
        const c = circle(point(2, 3), 2);
        const A0 = onCircle(c, pi / 3);
        assertAlmostEquals(A[0], A0[0]);
        assertAlmostEquals(A[1], A0[1]);
    },
});

Deno.test({
    name: "onSegment",
    fn() {
        assertEquals(onSegment([point(0, 1), point(1, 0)], 5)[0], 5);
        assertEquals(
            onSegment([point(0, 1), point(1, 0)], -1.5)[1],
            2.5,
        );
    },
});
