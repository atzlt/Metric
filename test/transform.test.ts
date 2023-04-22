import {
    assert,
    assertEquals,
    assertThrows,
} from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { Circle, circle, Line, line, point } from "../src/objects.ts";
import { isOverlap, isParallel, isThrough } from "../src/calc/basic.ts";
import { reflectIn, scale } from "../src/calc/transform.ts";

Deno.test({
    name: "reflect",
    fn() {
        const A = point(-3, 0);
        const B = point(-2, 0);
        const c = circle(A, 5);
        const d = circle(point(0, 1), Math.sqrt(10));
        const e = circle(B, 2);
        const l = line(1, 0, 0);
        const k = line(1, 0, -1);
        const m = line(2, -1, 0);
        const n = line(3, -4, -20);
        const l1 = reflectIn(l, m);
        const l2 = reflectIn(l, A);
        const A1 = reflectIn(A, l);
        const c1 = reflectIn(c, l);
        const c2 = reflectIn(c, B);
        const A2 = reflectIn(A, B);
        const k1 = reflectIn(k, l);
        const n1 = reflectIn(n, m);
        const Binv = reflectIn(B, c);
        const linv = reflectIn(l, c);
        const minv = reflectIn(m, c);
        const dinv = reflectIn(d, c);
        const einv = reflectIn(e, c);
        assert(isParallel(l1, n));
        assert(isThrough(n1, point(-4, -3)));
        assertEquals(A1[0], 3);
        assertEquals(c1[0][0], A1[0]);
        assertEquals(c1[1], c[1]);
        assertEquals(c2[0][0], A2[0]);
        assertEquals(c2[0][1], A2[1]);
        assert(isThrough(k1, point(-1, 6)));
        assert(isOverlap(l2, line(1, 0, 6)));
        assert(isOverlap(Binv, point(22, 0)));
        assert(isOverlap(<Line> reflectIn(linv, c), l));
        assert(isOverlap(<Line> reflectIn(minv, c), m));
        assert(isOverlap(<Circle> reflectIn(dinv, c), d));
        assert(isOverlap(<Circle> reflectIn(einv, c), e));
        assert(isOverlap(<Line> reflectIn(l, d), l));
        assertThrows(() => reflectIn(c[0], c));
    },
});

Deno.test({
    name: "scale",
    fn() {
        const O = point(-1, 0);
        const A = point(1, 2);
        const B = point(3, 4);
        const l = line(1, -1, A);
        const k = line(1, -1, B);
        const c = circle(A, 3);
        const d = circle(B, 6);
        const B0 = scale(A, O, 2);
        const k0 = scale(l, O, 2);
        const d0 = scale(c, O, 2);
        assert(isOverlap(B, B0));
        assert(isOverlap(k, k0));
        assert(isOverlap(d, d0));
    },
});
