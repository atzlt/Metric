import { assert, assertAlmostEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { angle, angleBisect, DEG, isOverlap, ROUND } from "../src/calc/basic.ts";
import { circle, line, point } from "../src/objects.ts";
import { rotate } from "../src/calc/transform.ts";

const xx = line(0, 1, 0);
const yy = line(1, 0, 0);
const O = point(0, 0);

Deno.test({
    name: "angle",
    fn() {
        assertAlmostEquals(
            Math.PI / 4,
            angle(
                line(2, -1, 0),
                line(1, -3, 1),
            ),
        );
        assertAlmostEquals(
            Math.PI / 4,
            angle(
                line(1, 0, 0),
                line(1, -1, 1),
            ),
        );
        assertAlmostEquals(
            Math.PI / 4,
            angle(
                line(1, -1, 1),
                line(1, 0, 0),
            ),
        );
        assertAlmostEquals(
            Math.PI / 4,
            angle(
                line(0, 1, 0),
                line(1, -1, 1),
            ),
        );
        assertAlmostEquals(
            Math.PI / 3,
            angle(
                point(Math.sqrt(3), -1),
                point(0, 0),
                point(Math.sqrt(3), 1),
            )
        );
        assertAlmostEquals(
            Math.PI / 3,
            angle(
                point(Math.sqrt(3), 1),
                point(0, 0),
                point(Math.sqrt(3), -1),
            )
        );
        assertAlmostEquals(
            Math.PI * 2 / 3,
            angle(
                point(-Math.sqrt(3), -1),
                point(0, 0),
                point(Math.sqrt(3), -1),
            )
        );
        assertAlmostEquals(
            Math.PI * 2 / 3,
            angle(
                point(Math.sqrt(3), -1),
                point(0, 0),
                point(-Math.sqrt(3), -1),
            )
        );
    },
});

Deno.test({
    name: "rotate",
    fn() {
        const O = point(1, 1);
        const A = point(2, 1 + Math.sqrt(3));
        const l = line(1, -2, 0);
        const c = circle(A, 2);
        const A0 = point(3, 1);
        const l0 = line(2, 1, -2);
        const c0 = circle(point(3, 1), 2);
        assert(isOverlap(rotate(A, O, -60 * DEG), A0));
        assert(isOverlap(rotate(l, O, -0.25 * ROUND), l0));
        assert(isOverlap(rotate(c, O, -Math.PI / 3), c0));
    },
});

Deno.test({
    name: "angle bisector",
    fn() {
        const A = point(1, 0);
        const B = point(0, 1);
        const C = point(0, -1);
        const D = point(-1, Math.sqrt(3));
        const l1 = line(1, -1, 0);
        const l2 = line(1, 1, 0);
        const l3 = line(Math.sqrt(3), -1, 0);
        assert(isOverlap(angleBisect(xx, yy)[0], l2));
        assert(isOverlap(angleBisect(A, O, B)[0], l1));
        assert(isOverlap(angleBisect(A, O, B)[1], l2));
        assert(isOverlap(angleBisect(B, O, A)[0], l1));
        assert(isOverlap(angleBisect(B, O, A)[1], l2));
        assert(isOverlap(angleBisect(A, O, C)[0], l2));
        assert(isOverlap(angleBisect(A, O, C)[1], l1));
        assert(isOverlap(angleBisect(A, O, D)[0], l3));
    },
});
