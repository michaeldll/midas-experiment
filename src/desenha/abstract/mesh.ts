import { mat4 } from 'gl-matrix'
import { Locations, Buffers, Geometry } from "../types"

export abstract class Mesh {
    name: string
    buffers: Buffers
    geometry: Geometry
    program: WebGLProgram
    locations: Locations

    constructor(name?: string) {
        if (name) this.name = name
        this.buffers = {}
    }

    setLocations = (gl: WebGLRenderingContext) => {
        // If location not found, value is -1
        this.locations = {
            attributes: {
                position: gl.getAttribLocation(this.program, 'aPosition'),
                color: gl.getAttribLocation(this.program, 'aVertexColor'),
                uv: gl.getAttribLocation(this.program, 'aUv')
            },
            uniforms: {
                projectionMatrix: gl.getUniformLocation(this.program, 'uProjectionMatrix'),
                modelViewMatrix: gl.getUniformLocation(this.program, 'uModelViewMatrix'),
                texture: gl.getUniformLocation(this.program, 'uTexture')
            }
        }
    }

    // Set a 2D texture
    loadTexture = (gl: WebGLRenderingContext, path: string) => {
        const texture = gl.createTexture();
        const image = new Image();
        image.src = path;
        image.onload = () => {
            // Flip the image's y axis
            // gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

            // Enable texture 0
            gl.activeTexture(gl.TEXTURE0);

            // Set the texture's target (2D or cubemap)
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Stretch/wrap options
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            // Bind image to texture
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

            // Mipmaps
            gl.generateMipmap(gl.TEXTURE_2D);

            // Pass texture 0 to the sampler
            gl.uniform1i(this.locations.uniforms.texture, 0);
        }
    }

    calcMatrixes = (gl: WebGLRenderingContext, rotation: number) => {
        // Projection
        const projectionMatrix = mat4.create();

        // Perspective
        // {
        //     const fieldOfView = 45 * Math.PI / 180;   // in radians
        //     const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        //     const zNear = 0.1;
        //     const zFar = 100.0;

        //     mat4.perspective(
        //         projectionMatrix,
        //         fieldOfView,
        //         aspect,
        //         zNear,
        //         zFar
        //     );
        // }

        // Orthographic
        {
            const glCanvas = gl.canvas as HTMLCanvasElement
            const aspect = glCanvas.clientWidth / glCanvas.clientHeight;
            const left = -5 * aspect;
            const right = 5 * aspect;
            const bottom = 5;
            const top = -5;
            const near = 0.1;
            const far = 100;

            mat4.ortho(projectionMatrix, left, right, bottom, top, near, far)
        }

        const modelMatrix = mat4.create();

        mat4.scale(modelMatrix, modelMatrix, [1, 1, 1])
        mat4.translate(modelMatrix,
            modelMatrix,
            [-0.0, 0.0, -15.0]);
        mat4.rotate(modelMatrix,
            modelMatrix,
            rotation,     // amount to rotate in radians
            [0, 0, 1]);       // axis to rotate around (Z)
        mat4.rotate(modelMatrix,  // destination matrix
            modelMatrix,
            rotation * .7,// amount to rotate in radians
            [0, 1, 0]);       // axis to rotate around (X)

        // Set shader uniforms
        gl.uniformMatrix4fv(
            this.locations.uniforms.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            this.locations.uniforms.modelViewMatrix,
            false,
            modelMatrix);
    }

    getAttributesFromBuffers = (gl: WebGLRenderingContext) => {
        const { vertices, indices, colors, uvs } = this.buffers

        if (vertices) {
            // Pull out the positions from the position
            // buffer into the vertexPosition attribute
            {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertices);

                const index = this.locations.attributes.position as number
                const numComponents = 3;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.vertexAttribPointer(
                    index,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);

                gl.enableVertexAttribArray(index);
            }
        }

        if (uvs) {
            // Pull out the texture coordinates from the uv buffer
            // into the uv attribute.
            {

                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.uvs);

                const index = this.locations.attributes.uv as number
                const size = 2;          // 2 components per iteration
                const type = gl.FLOAT;   // the data is 32bit floats
                const normalize = false; // don't normalize the data
                const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
                const offset = 0;        // start at the beginning of the buffer

                gl.enableVertexAttribArray(index);
                gl.vertexAttribPointer(index, size, type, normalize, stride, offset);
            }
        }

        if (colors) {
            // Pull out the colors from the color buffer
            // into the vertexColor attribute.
            {
                const index = this.locations.attributes.color as number
                const numComponents = 4;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.colors);
                gl.vertexAttribPointer(
                    index,
                    numComponents,
                    type,
                    normalize,
                    stride,
                    offset);
                gl.enableVertexAttribArray(index);
            }
        }

        if (indices) {
            // Tell WebGL which indices to use to index the vertices
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices);
        }
    }

    setBuffers = (gl: WebGLRenderingContext) => {
        const { vertices, indices, colors, uvs } = this.geometry

        if (vertices) {
            this.setBuffer(gl, 'vertices')
        }

        if (indices) {
            // Build the element array buffer; this specifies the indices
            // into the vertex arrays for each face's vertices.
            const indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            this.buffers.indices = indexBuffer
        }

        if (colors) {
            this.setBuffer(gl, 'colors')
        }

        if (uvs) {
            this.setBuffer(gl, 'uvs')
        }
    }

    setBuffer = (gl: WebGLRenderingContext, nameProp: string) => {
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.geometry[nameProp], gl.STATIC_DRAW);
        this.buffers[nameProp] = buffer
    }
}