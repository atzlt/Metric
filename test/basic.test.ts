import {
    assertEquals,
    assertAlmostEquals,
    assertThrows,
} from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { Line, Point, Circle } from "../src/objects.ts";
import { interCC, interLC, interLL } from "../src/calc/basic.ts";

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
        assertEquals(c.O.x, 0.5);
        const E = new Point(0, 1);
        assertThrows(() => new Line(B, E));
        assertThrows(() => new Circle(A, B, E));
    }
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
    }
});

Deno.test({
    name: "interLC, interCC",
    fn() {
        const A = new Point(0, 0);
        const B = new Point(3, 0);
        const c = new Circle(A, 4);
        const d = new Circle(B, 5);
        const l = new Line(1, 0, -6);
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
        const [H] = interCC(c, d, D);
        assertAlmostEquals(H.y, -4);
    }
});
