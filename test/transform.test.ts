import { assert, assertEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { reflectIn } from "../src/calc/transform.ts";
import { Point,Circle,Line } from "../src/objects.ts";
import { isParallel, isThrough } from "../src/calc/basic.ts";

Deno.test({
    name: "reflect",
    fn() {
        let A = new Point(-3, 0);
        let B = new Point(-2, 0);
        let c = new Circle(A, 5);
        let l = new Line(1, 0, 0);
        let k = new Line(1, 0, -1);
        let m = new Line(2, -1, 0);
        let n = new Line(3, -4, -20);
        let l1 = reflectIn(l, m);
        let A1 = reflectIn(A, l);
        let c1 = reflectIn(c, l);
        let c2 = reflectIn(c, B);
        let A2 = reflectIn(A, B);
        let k1 = reflectIn(k, l);
        let n1 = reflectIn(n, m);
        assert(isParallel(l1, n));
        assert(isThrough(n1, new Point(-4, -3)));
        assertEquals(A1.x, 3);
        assertEquals(c1.O.x, A1.x);
        assertEquals(c1.r, c.r);
        assertEquals(c2.O.x, A2.x);
        assertEquals(c2.O.y, A2.y);
        assert(isThrough(k1, new Point(-1, 6)));
    }
})
