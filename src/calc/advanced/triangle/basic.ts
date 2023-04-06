import { Point } from "../../../objects.ts";
import { distance } from "../../basic.ts";

export type Triangle = [Point, Point, Point];

export function sideLength([A, B, C]: Triangle): [number, number, number] {
    return [distance(B, C), distance(C, A), distance(A, B)];
}
