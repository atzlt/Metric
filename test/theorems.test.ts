import { assert } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { center, interCC, interLC, interLL, isParallel, isThrough, perp, perp_bisect } from "../src/calc/basic.ts";
import { onCircle } from "../src/calc/point_on.ts";
import { Circle, Line, Point } from "../src/objects.ts";

Deno.test({
    name: "Reim's Thm.",
    fn() {
        let c1 = new Circle(new Point(2, 1), 3);
        let c2 = new Circle(new Point(-3, 0), 4);
        let [A, B] = interCC(c1, c2);
        let C = onCircle(c1, Math.PI * 2 / 3);
        let D = onCircle(c1, Math.PI);
        let [E] = interLC(new Line(C, A), c2, A);
        let [F] = interLC(new Line(D, B), c2, B);
        assert(isParallel(new Line(E, F), new Line(C, D)));
    }
});

Deno.test({
    name: "Euler line",
    fn() {
        let A = new Point(1, 3);
        let B = new Point(-2.3, 7.2);
        let C = new Point(0.5, 8.2);
        let O = interLL(perp_bisect(A, B), perp_bisect(B, C));
        let H = interLL(perp(A, new Line(B, C)), perp(B, new Line(A, C)));
        let G = center([A, B, C]);
        assert(isThrough(new Line(O, H), G));
    }
});
