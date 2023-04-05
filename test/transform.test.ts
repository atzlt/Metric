import { assert, assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { reflectIn } from "../src/calc/transform.ts";
import { Point, Circle, Line } from "../src/objects.ts";
import { isOverlap, isParallel, isThrough } from "../src/calc/basic.ts";

Deno.test({
    name: "reflect",
    fn() {
        const A = new Point(-3, 0);
        const B = new Point(-2, 0);
        const c = new Circle(A, 5);
        const l = new Line(1, 0, 0);
        const k = new Line(1, 0, -1);
        const m = new Line(2, -1, 0);
        const n = new Line(3, -4, -20);
        const l1 = reflectIn(l, m);
        const l2 = reflectIn(l, A);
        const A1 = reflectIn(A, l);
        const c1 = reflectIn(c, l);
        const c2 = reflectIn(c, B);
        const A2 = reflectIn(A, B);
        const k1 = reflectIn(k, l);
        const n1 = reflectIn(n, m);
        assert(isParallel(l1, n));
        assert(isThrough(n1, new Point(-4, -3)));
        assertEquals(A1.x, 3);
        assertEquals(c1.O.x, A1.x);
        assertEquals(c1.r, c.r);
        assertEquals(c2.O.x, A2.x);
        assertEquals(c2.O.y, A2.y);
        assert(isThrough(k1, new Point(-1, 6)));
        assert(isOverlap(l2, new Line(1, 0, 6)));
    }
});
