import {
    assert,
    assertAlmostEquals,
    assertEquals,
    assertFalse,
    assertThrows,
} from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { Circle, Line, Point } from "../src/objects.ts";
import {
    distance,
    interCC,
    interLC,
    interLL,
    isCollinear,
    isParallel,
    isThrough,
    parallel,
    perp,
    projection,
} from "../src/calc/basic.ts";

Deno.test({
    name: "GObjects definition",
    fn() {
        const A = new Point(0, 0);
        const B = new Point(0, 1);
        const C = new Point(1, 0);
        const D = new Point(1, 1);
        const m = new Line(B, C);
        const n = new Line(A, D);
        const k = new Line(2, -1, D);
        assertEquals(k.C, -1);
        const O = interLL(m, n);
        assertEquals(O.x, 0.5);
        const c = new Circle(A, B, C);
        const c0 = new Circle(O, A);
        assertEquals(c.O.x, 0.5);
        assertEquals(c.r, c0.r);
        assertEquals(c.r, Math.SQRT1_2);
        const E = new Point(0, 1);
        assertThrows(() => new Line(B, E));
        assertThrows(() => new Circle(A, B, E));
        assertEquals(B.toString(), "(0, 1)");
        assertEquals(m.toString(), "x + y + -1 = 0");
    },
});

Deno.test({
    name: "isThrough, isParallel, isCollinear",
    fn() {
        const A = new Point(0, 0);
        const B = new Point(5, 12);
        const C = new Point(10, 24);
        const D = new Point(100, 240.01);
        const E = new Point(10, 24.01);
        const l = new Line(A, C);
        const l0 = new Line(A, D);
        const k = new Line(E, D);
        const c = new Circle(A, 13);
        assert(isParallel(l, k));
        assert(isCollinear(A, B, C));
        assert(isThrough(c, B));
        assertFalse(isThrough(l0, C));
    },
});

Deno.test({
    name: "parallel, perp, projection",
    fn() {
        const l = new Line(2, 1, -2);
        const k = new Line(1, 1, -1);
        const A = new Point(2, 3);
        assertEquals(projection(A, l).x, 0);
        assertEquals(projection(A, l).y, 2);
        assertEquals(projection(A, k).y, 1);
        assert(isThrough(parallel(A, k), new Point(3, 2)));
        assert(isThrough(parallel(l, A), new Point(3, 1)));
        assert(isThrough(perp(A, l), new Point(1, 2.5)));
        assert(isThrough(perp(k, A), new Point(1, 2)));
    },
});

Deno.test({
    name: "distance",
    fn() {
        const A = new Point(0, 1);
        const l = new Line(1, -1, 0);
        const k = new Line(1, -1, -1);
        const m = new Line(-1.1, 1, 0);
        assertEquals(distance(A, l), Math.SQRT1_2);
        assertEquals(distance(k, A), Math.SQRT2);
        assertEquals(distance(k, l), Math.SQRT1_2);
        assertThrows(() => distance(k, m));
    },
});

Deno.test({
    name: "interLL, interLC",
    fn() {
        const A = new Point(0, 0);
        const B = new Point(0, 1);
        const C = new Point(1, 0);
        const D = new Point(1, 1);
        const l = new Line(A, B);
        const m = new Line(B, C);
        const n = new Line(A, D);
        const p = new Line(C, D);
        const O = interLL(m, n);
        assertEquals(O.x, 0.5);
        const c = new Circle(O, Math.SQRT1_2);
        const inters = interLC(l, c);
        const [E, F] = inters.sort((X, Y) => X.y - Y.y);
        assertAlmostEquals(E.x, 0);
        assertAlmostEquals(F.y, 1);
        assertThrows(() => interLL(l, p));
    },
});

Deno.test({
    name: "interLC, interCC",
    fn() {
        const A = new Point(0, 0);
        const B = new Point(3, 0);
        const c = new Circle(A, 4);
        const d = new Circle(B, 5);
        const l = new Line(1, 0, -6);
        const k = new Line(0, 1, -3);
        const [E, F] = interLC(l, d);
        assertAlmostEquals(E.x, 6);
        assertAlmostEquals(Math.abs(F.y), 4);
        const m = new Line(0, 1, -4);
        const [X, Y] = interLC(m, c);
        assertAlmostEquals(X.x, 0);
        assertAlmostEquals(Y.x, 0);
        assertAlmostEquals(X.y, 4);
        assertAlmostEquals(Y.y, 4);
        const [C, D] = interCC(c, d).sort((X, Y) => X.y - Y.y);
        assertAlmostEquals(D.y, 4);
        assertAlmostEquals(C.x, 0);
        assertEquals(interLC(l, c), []);
        const [G] = interLC(l, d, E);
        assertAlmostEquals(G.x, 6);
        const [K] = interLC(k, d, new Point(-1, 3));
        assertAlmostEquals(K.x, 7);
        const [H] = interCC(c, d, D);
        assertAlmostEquals(H.y, -4);
    },
});
