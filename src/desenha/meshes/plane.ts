import { Mesh } from "../abstract/mesh";

export default class Plane extends Mesh {
    constructor() {
        super()
        this.vertices = new Float32Array([
            -1.0, -1.0, 0.0,
            1.0, -1.0, 0.0,
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
        ]);

        this.normals = new Float32Array([
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
        ]);

        this.indices = new Uint16Array([
            0, 1, 2, 0, 2, 3,
        ]);

        // Interleaved texture coordinates buffer
        this.uv = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ]);

        this.uvFloatSize = this.uv.BYTES_PER_ELEMENT; // bytes per float (4)
    }
}