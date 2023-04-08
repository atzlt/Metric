import { distance, inter, projection } from "./calc/basic.ts";
import { reflectIn } from "./calc/transform.ts";
import { circle, line, point } from "./objects.ts";

export * from "./calc/basic.ts";
export * from "./objects.ts";
export * as centers from "./calc/advanced/triangle/center.ts";
export * as calc from "./calc/mod.ts";

export const p = point;
export const l = line;
export const o = circle;
export const i = inter;
export const d = distance;
export const pr = projection;
export const refl = reflectIn;
