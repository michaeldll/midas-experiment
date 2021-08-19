export type Buffers = {
    positionBuffer: WebGLBuffer,
    indexBuffer: WebGLBuffer,
    colorBuffer?: WebGLBuffer,
    uvBuffer?: WebGLBuffer,
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