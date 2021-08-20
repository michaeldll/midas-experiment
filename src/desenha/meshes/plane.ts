import { Mesh } from "../abstract/mesh";

export default class Plane extends Mesh {
    constructor() {
        super()

        this.geometry = {
            vertices: new Float32Array([
                -1.0, -1.0, 0.0,
                1.0, -1.0, 0.0,
                1.0, 1.0, 0.0,
                -1.0, 1.0, 0.0,
            ]),
            normals: new Float32Array([
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
                0.0, 0.0, 1.0,
            ]),
            indices: new Uint16Array([
                0, 1, 2, 0, 2, 3,
            ]),
            uvs: new Float32Array([
                0.0, 0.0,
                1.0, 0.0,
                1.0, 1.0,
                0.0, 1.0,
            ])
        }
    }
}