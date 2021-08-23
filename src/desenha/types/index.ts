export type Buffers = {
    [bufferName: string]: WebGLBuffer
}

export type Locations = {
    attributes: {
        [attributeName: string]: WebGLUniformLocation
    },
    uniforms: {
        [uniformName: string]: WebGLUniformLocation
    }
}

export type LocationOption = ['attribute' | 'uniform', string]

export type Geometry = {
    positions: Float32Array
    normals?: Float32Array
    indices?: Uint16Array
    colors?: Float32Array
    uvs?: Float32Array
}

export type Vector3 = {
    x: number,
    y: number,
    z: number
}

export type MeshParameters = {
    translation: Vector3,
    rotation: Vector3,
    scale: Vector3
}

export type MeshConstructor = {
    program: WebGLProgram,
    locationNames: {
        attributes: string[]
        uniforms: string[]
    }
    gl: WebGLRenderingContext
    parameters?: MeshParameters
    name?: string
}