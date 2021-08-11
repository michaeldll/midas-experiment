import { mat4 } from 'gl-matrix'
import { glsl, resizeCanvasToDisplaySize, getShaderProgram } from './utils/'
import Cube from './meshes/cube';
import Plane from './meshes/plane';
import { Buffers, Locations, Parameters } from './types';
import { Mesh } from './abstract/meshes';
import { Pane } from 'tweakpane';

export default function main(pane?: Pane) {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl', { powerPreference: "high-performance" });

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }


    const program: WebGLProgram = initProgram(gl)
    const locations: Locations = initLocations(gl, program)
    const meshes: Mesh[] = [new Plane()]
    const buffers: Buffers = initBuffers(gl, meshes);

    const PARAMS: Parameters = { rotation: 0.0 }
    if (pane) initTweaks(pane, PARAMS)
    let then = 0;

    function render(now: number) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        drawScene(canvas, gl, program, locations, buffers, meshes, PARAMS, deltaTime, pane);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function initProgram(gl) {
    const vertexShader = glsl`
        attribute vec4 aVertexPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vColor = aVertexColor;
        }
    `;

    const fragmentShader = glsl`
        varying lowp vec4 vColor;

        void main(void) {
        // gl_FragColor = vColor;
            gl_FragColor = vec4(vec3(1.,0.,0.),1.);
        }
    `;

    return getShaderProgram(gl, vertexShader, fragmentShader);
}

function initLocations(gl: WebGLRenderingContext, program: WebGLProgram) {
    return {
        attributes: {
            vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(program, 'aVertexColor'),
        },
        uniforms: {
            projectionMatrix: gl.getUniformLocation(program, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(program, 'uModelViewMatrix'),
        }
    };
}

function initBuffers(gl: WebGLRenderingContext, meshes: Mesh[]) {
    const buffers: Buffers = {
        position: [],
        color: [],
        index: []
    }

    for (const mesh of meshes) {
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, mesh.vertices, gl.STATIC_DRAW);
        buffers.position.push(positionBuffer)

        if (mesh.colors) {
            const colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, mesh.colors, gl.STATIC_DRAW);
            buffers.color.push(colorBuffer)
        }

        // Build the element array buffer; this specifies the indices
        // into the vertex arrays for each face's vertices.
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);
        buffers.index.push(indexBuffer)
    }

    return buffers
}

function initTweaks(pane: Pane & any /* broken type ? */, params: Parameters) {
    const inputs = []

    inputs.push(pane.addInput(params, 'rotation'))

    // inputs.push(
    //     pane.addInput(params, 'translation', {
    //         x: { min: 0, max: window.innerWidth },
    //         y: { min: 0, max: window.innerHeight },
    //         z: { min: -1, max: 1 }
    //     })
    // )

    // inputs.push(
    //     pane.addInput(params, 'rotation', {
    //         x: { min: -2 * Math.PI, max: 2 * Math.PI },
    //         y: { min: -2 * Math.PI, max: 2 * Math.PI },
    //         z: { min: -2 * Math.PI, max: 2 * Math.PI }
    //     })
    // )
}

function drawScene(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, program: WebGLProgram, locations: Locations, buffers: Buffers, meshes: Mesh[], PARAMS: Parameters, deltaTime: number, pane?: Pane) {
    resizeCanvasToDisplaySize(canvas, window.devicePixelRatio)

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

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

    const modelViewMatrix = mat4.create();

    mat4.scale(modelViewMatrix, modelViewMatrix, [1, 1, 1])
    mat4.translate(modelViewMatrix,
        modelViewMatrix,
        [-0.0, 0.0, -15.0]);
    mat4.rotate(modelViewMatrix,
        modelViewMatrix,
        PARAMS.rotation,     // amount to rotate in radians
        [0, 0, 1]);       // axis to rotate around (Z)
    mat4.rotate(modelViewMatrix,  // destination matrix
        modelViewMatrix,
        PARAMS.rotation * .7,// amount to rotate in radians
        [0, 1, 0]);       // axis to rotate around (X)

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
        const index = locations.attributes.vertexPosition as number
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position[0]);
        gl.vertexAttribPointer(
            index,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(index);
    }

    if (buffers.color.length) {
        // Tell WebGL how to pull out the colors from the color buffer
        // into the vertexColor attribute.
        {
            const index = locations.attributes.vertexColor as number
            const numComponents = 4;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color[0]);
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

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index[0]);

    gl.useProgram(program);

    // Set shader uniforms
    gl.uniformMatrix4fv(
        locations.uniforms.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        locations.uniforms.modelViewMatrix,
        false,
        modelViewMatrix);

    // Draw
    {
        const vertexCount = meshes[0].vertices.length / (meshes[0].vertices.length / meshes[0].indices.length);
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    PARAMS.rotation += deltaTime;

    pane.refresh()
}

