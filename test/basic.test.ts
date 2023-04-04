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
        let A = new Point(0, 0);
        let B = new Point(0, 1);
        let C = new Point(1, 0);
        let D = new Point(1, 1);
        let m = new Line(B, C);
        let n = new Line(A, D);
        let k = new Line(2, -1, D);
        assertEquals(k.C, -1);
        let O = interLL(m, n);
        assertEquals(O.x, 0.5);
        let c = new Circle(A, B, C);
        assertEquals(c.O.x, 0.5);
        let E = new Point(0, 1);
        assertThrows(() => new Line(B, E));
        assertThrows(() => new Circle(A, B, E));
    }
});

Deno.test({
    name: "interLL, interLC",
    fn() {
        let A = new Point(0, 0);
        let B = new Point(0, 1);
        let C = new Point(1, 0);
        let D = new Point(1, 1);
        let l = new Line(A, B);
        let m = new Line(B, C);
        let n = new Line(A, D);
        let p = new Line(C, D);
        let O = interLL(m, n);
        assertEquals(O.x, 0.5);
        let c = new Circle(O, Math.SQRT1_2);
        let inters = interLC(l, c);
        let [E, F] = inters.sort((X, Y) => X.y - Y.y);
        assertAlmostEquals(E.x, 0);
        assertAlmostEquals(F.y, 1);
        assertThrows(() => interLL(l, p));
    }
});

Deno.test({
    name: "interLC, interCC",
    fn() {
        let A = new Point(0, 0);
        let B = new Point(3, 0);
        let c = new Circle(A, 4);
        let d = new Circle(B, 5);
        let l = new Line(1, 0, -6);
        let [E, F] = interLC(l, d);
        assertAlmostEquals(E.x, 6);
        assertAlmostEquals(Math.abs(F.y), 4);
        let m = new Line(0, 1, -4);
        let [X, Y] = interLC(m, c);
        assertAlmostEquals(X.x, 0);
        assertAlmostEquals(Y.x, 0);
        assertAlmostEquals(X.y, 4);
        assertAlmostEquals(Y.y, 4);
        let [C, D] = interCC(c, d).sort((X, Y) => X.y - Y.y);
        assertAlmostEquals(D.y, 4);
        assertAlmostEquals(C.x, 0);
        assertEquals(interLC(l, c), []);
        let [G] = interLC(l, d, E);
        assertAlmostEquals(G.x, 6);
        let [H] = interCC(c, d, D);
        assertAlmostEquals(H.y, -4);
    }
});
