import { assert, assertAlmostEquals } from "https://deno.land/std@0.182.0/testing/asserts.ts";
import { fromBarycentric, incenter, symmedian } from "../src/calc/advanced/triangle/center.ts";
import { center, isCollinear, isOverlap, isParallel } from "../src/calc/basic.ts";
import * as m from "../src/index.ts";

Deno.bench({ name: "prepare", fn() {} });
Deno.bench({ name: "noop", baseline: true, fn() {} });

Deno.bench({
    name: "Reim's Thm.",
    fn() {
        const c1 = m.o(m.p(2, 1), 3);
        const c2 = m.o(m.p(-3, 0), 4);
        const [A, B] = m.i(c1, c2);
        const C = m.onCircle(c1, Math.PI * 2 / 3);
        const D = m.onCircle(c1, Math.PI);
        const [E] = m.i(m.l(C, A), c2, A);
        const [F] = m.i(m.l(D, B), c2, B);
        assert(isParallel(m.l(E, F), m.l(C, D)));
    },
});

Deno.bench({
    name: "Euler line",
    fn() {
        const A = m.p(1, 3);
        const B = m.p(-2.3, 7.2);
        const C = m.p(0.5, 8.2);
        const O = m.i(m.pb(A, B), m.pb(B, C));
        const H = m.i(m.pe(A, m.l(B, C)), m.pe(B, m.l(A, C)));
        const G = center(A, B, C);
        assert(isCollinear(O, H, G));
    },
});

Deno.bench({
    name: "Incenter",
    fn() {
        const A = m.p(1, 3);
        const B = m.p(-2.3, 7.2);
        const C = m.p(0.5, 8.2);
        const I = incenter([A, B, C]);
        const d = m.d(I, m.l(A, B));
        const e = m.d(I, m.l(C, B));
        const f = m.d(I, m.l(A, C));
        assertAlmostEquals(d, e);
        assertAlmostEquals(e, f);
    },
});

Deno.bench({
    name: "Symmedian Barycentric",
    fn() {
        const A = m.p(1, 3);
        const B = m.p(-2.3, 7.2);
        const C = m.p(0.5, 8.2);
        const a = m.d(B, C);
        const b = m.d(A, C);
        const c = m.d(B, A);
        const K = symmedian([A, B, C]);
        const K0 = fromBarycentric([A, B, C], [a * a, b * b, c * c]);
        assert(isOverlap(K, K0));
    },
});
