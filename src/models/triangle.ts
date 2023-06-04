import { Model } from "../model.js";

export function GetTriangleModel(): Model {

    const vertices: number[] = [0.0, 0.75, 0.0, 1.0, 0.0, 0.0, -0.75, -0.75, 0.0, 0.0, 1.0, 0.0, 0.75, -0.75, 0.0, 0.0, 0.0, 1.0];
    const indices: number[] = [0, 1, 2];

    return new Model(vertices, indices);
}