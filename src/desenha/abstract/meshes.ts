import { Locations } from "../types"

export abstract class Mesh {
    vertices: Float32Array
    normals: Float32Array
    indices: Uint16Array
    program: WebGLProgram
    locations: Locations
    colors?: Float32Array
}