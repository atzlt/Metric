import {
    assert,
    assertEquals,
    assertThrows,
} from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { Circle, Line } from "../src/objects.ts";
import { isOverlap, isParallel, isThrough } from "../src/calc/basic.ts";
import { o, p, refl } from "../src/index.ts";

Deno.test({
    name: "reflect",
    fn() {
        const A = p(-3, 0);
        const B = p(-2, 0);
        const c = o(A, 5);
        const d = o(p(0, 1), Math.sqrt(10));
        const e = o(B, 2);
        const l = new Line(1, 0, 0);
        const k = new Line(1, 0, -1);
        const m = new Line(2, -1, 0);
        const n = new Line(3, -4, -20);
        const l1 = refl(l, m);
        const l2 = refl(l, A);
        const A1 = refl(A, l);
        const c1 = refl(c, l);
        const c2 = refl(c, B);
        const A2 = refl(A, B);
        const k1 = refl(k, l);
        const n1 = refl(n, m);
        const Binv = refl(B, c);
        const linv = refl(l, c);
        const minv = refl(m, c);
        const dinv = refl(d, c);
        const einv = refl(e, c);
        assert(isParallel(l1, n));
        assert(isThrough(n1, p(-4, -3)));
        assertEquals(A1.x, 3);
        assertEquals(c1.O.x, A1.x);
        assertEquals(c1.r, c.r);
        assertEquals(c2.O.x, A2.x);
        assertEquals(c2.O.y, A2.y);
        assert(isThrough(k1, p(-1, 6)));
        assert(isOverlap(l2, new Line(1, 0, 6)));
        assert(isOverlap(Binv, p(22, 0)));
        assert(isOverlap(<Line> refl(linv, c), l));
        assert(isOverlap(<Line> refl(minv, c), m));
        assert(isOverlap(<Circle> refl(dinv, c), d));
        assert(isOverlap(<Circle> refl(einv, c), e));
        assert(isOverlap(<Line> refl(l, d), l));
        assertThrows(() => refl(c.O, c));
    },
});
