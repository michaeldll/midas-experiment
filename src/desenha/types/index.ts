export type Buffers = {
    position: WebGLBuffer[],
    index: WebGLBuffer[],
    color?: WebGLBuffer[]
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