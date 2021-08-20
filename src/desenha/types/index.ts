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

export type Parameters = {
    [parameter: string]: any
}

export type Geometry = {
    vertices: Float32Array
    normals: Float32Array
    indices: Uint16Array
    colors?: Float32Array
    uvs?: Float32Array
}