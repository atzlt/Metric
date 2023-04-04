import { assertAlmostEquals, assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { onCircle, onSegment } from "../src/calc/point_on.ts";
import { Circle, Point } from "../src/objects.ts";

Deno.test({
    name: "onCircle",
    fn() {
        let pi = Math.PI;
        let A = new Point(3, 3 + Math.sqrt(3));
        let c = new Circle(new Point(2, 3), 2);
        let A0 = onCircle(c, pi / 3);
        assertAlmostEquals(A.x, A0.x);
        assertAlmostEquals(A.y, A0.y);
    }
})

Deno.test({
    name: "onSegment",
    fn() {
        let seg = [new Point(0, 1), new Point(1, 0)];
        assertEquals(onSegment(seg, 5).x, 5);
        assertEquals(onSegment(seg, -1.5).y, 2.5);
    }
})
