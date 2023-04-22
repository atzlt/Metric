import {
    assert,
    assertAlmostEquals,
    assertEquals,
    assertFalse,
    assertThrows,
} from "https://deno.land/std@0.182.0/testing/asserts.ts";
import {
    distance,
    inter,
    isCollinear,
    isOverlap,
    isParallel,
    isThrough,
    parallel,
    perp,
    polarLine,
    projection,
} from "../src/calc/basic.ts";
import { circle, line, point } from "../src/objects.ts";
import { tangent } from "../src/index.ts";

Deno.test({
    name: "GObjects definition",
    fn() {
        const A = point(0, 0);
        const B = point(0, 1);
        const C = point(1, 0);
        const D = point(1, 1);
        const m = line(B, C);
        const n = line(A, D);
        const k = line(2, -1, D);
        assertEquals(k[2], -1);
        const O = inter(m, n);
        assertEquals(O[0], 0.5);
        const c = circle(A, B, D);
        const c0 = circle(O, A);
        assertEquals(c[0][0], 0.5);
        assertEquals(c[1], c0[1]);
        assertEquals(c[1], Math.SQRT1_2);
        const E = point(0, 1);
        assertThrows(() => line(B, E));
        assertThrows(() => circle(A, B, E));
    },
});

Deno.test({
    name: "isThrough, isParallel, isCollinear",
    fn() {
        const A = point(0, 0);
        const B = point(5, 12);
        const C = point(10, 24);
        const D = point(100, 240.01);
        const E = point(10, 24.01);
        const l = line(A, C);
        const l0 = line(A, D);
        const k = line(E, D);
        const c = circle(A, 13);
        assert(isParallel(l, k));
        assert(isCollinear(A, B, C));
        assert(isThrough(c, B));
        assertFalse(isThrough(l0, C));
    },
});

Deno.test({
    name: "parallel, perp, projection",
    fn() {
        const l = line(2, 1, -2);
        const k = line(1, 1, -1);
        const A = point(2, 3);
        assertEquals(projection(A, l)[0], 0);
        assertEquals(projection(A, l)[1], 2);
        assertEquals(projection(A, k)[1], 1);
        assert(isThrough(parallel(A, k), point(3, 2)));
        assert(isThrough(parallel(l, A), point(3, 1)));
        assert(isThrough(perp(A, l), point(1, 2.5)));
        assert(isThrough(perp(k, A), point(1, 2)));
    },
});

Deno.test({
    name: "distance",
    fn() {
        const A = point(0, 1);
        const l = line(1, -1, 0);
        const k = line(1, -1, -1);
        const m = line(-1.1, 1, 0);
        assertEquals(distance(A, l), Math.SQRT1_2);
        assertEquals(distance(k, A), Math.SQRT2);
        assertEquals(distance(k, l), Math.SQRT1_2);
        assertThrows(() => distance(k, m));
    },
});

Deno.test({
    name: "interLL, interLC",
    fn() {
        const A = point(0, 0);
        const B = point(0, 1);
        const C = point(1, 0);
        const D = point(1, 1);
        const l = line(A, B);
        const m = line(B, C);
        const n = line(A, D);
        const p = line(C, D);
        const O = inter(m, n);
        assertEquals(O[0], 0.5);
        const c = circle(O, Math.SQRT1_2);
        const inters = inter(l, c);
        const inters1 = inter(c, l);
        const [E, F] = inters.sort((X, Y) => X[1] - Y[1]);
        assertAlmostEquals(E[0], 0);
        assertAlmostEquals(F[1], 1);
        assert(isOverlap(inters[0], inters1[1]));
        assertThrows(() => inter(l, p));
    },
});

Deno.test({
    name: "interLC, interCC",
    fn() {
        const A = point(0, 0);
        const B = point(3, 0);
        const c = circle(A, 4);
        const d = circle(B, 5);
        const l = line(1, 0, -6);
        const k = line(0, 1, -3);
        const [E, F] = inter(l, d);
        assertAlmostEquals(E[0], 6);
        assertAlmostEquals(Math.abs(F[1]), 4);
        const m = line(0, 1, -4);
        const [X, Y] = inter(m, c);
        assertAlmostEquals(X[0], 0);
        assertAlmostEquals(Y[0], 0);
        assertAlmostEquals(X[1], 4);
        assertAlmostEquals(Y[1], 4);
        const [C, D] = inter(c, d).sort((X, Y) => X[1] - Y[1]);
        assertAlmostEquals(D[1], 4);
        assertAlmostEquals(C[0], 0);
        assertEquals(inter(l, c), []);
        const [G] = inter(l, d, E);
        assertAlmostEquals(G[0], 6);
        const [K] = inter(k, d, point(-1, 3));
        assertAlmostEquals(K[0], 7);
        const [H] = inter(c, d, D);
        assertAlmostEquals(H[1], -4);
    },
});

Deno.test({
    name: "tangent, polar line",
    fn() {
        const c = circle([0, 0], 1);
        const A = point(Math.SQRT2, 0);
        const B = point(1, 0);
        const l = line(1, 0, -Math.SQRT1_2);
        const k = line(1, 0, B);
        const s = line(1, 1, A);
        const t = line(1, -1, A);
        const l0 = polarLine(A, c);
        const [s0, t0] = tangent(A, c);
        const [k0] = tangent(B, c);
        assert(isOverlap(l, l0));
        assert(isOverlap(k, k0));
        assert(isOverlap(s, s0));
        assert(isOverlap(t, t0));
    },
});
