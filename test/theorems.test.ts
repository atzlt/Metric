import { assert } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { center, interCC, interLC, interLL, isCollinear, isParallel, perp, perp_bisect } from "../src/calc/basic.ts";
import { onCircle } from "../src/calc/point_on.ts";
import { Circle, Line, Point } from "../src/objects.ts";

Deno.test({
    name: "Reim's Thm.",
    fn() {
        const c1 = new Circle(new Point(2, 1), 3);
        const c2 = new Circle(new Point(-3, 0), 4);
        const [A, B] = interCC(c1, c2);
        const C = onCircle(c1, Math.PI * 2 / 3);
        const D = onCircle(c1, Math.PI);
        const [E] = interLC(new Line(C, A), c2, A);
        const [F] = interLC(new Line(D, B), c2, B);
        assert(isParallel(new Line(E, F), new Line(C, D)));
    }
});

Deno.test({
    name: "Euler line",
    fn() {
        const A = new Point(1, 3);
        const B = new Point(-2.3, 7.2);
        const C = new Point(0.5, 8.2);
        const O = interLL(perp_bisect(A, B), perp_bisect(B, C));
        const H = interLL(perp(A, new Line(B, C)), perp(B, new Line(A, C)));
        const G = center(A, B, C);
        assert(isCollinear(O, H, G));
    }
});
