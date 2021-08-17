import { mat4 } from 'gl-matrix'
import { glsl, resizeCanvasToDisplaySize, getShaderProgram, initBuffers } from './utils/'
import Plane from './meshes/plane';
// import Cube from './meshes/cube';
import { Buffers, Locations, Parameters } from './types';
import { Mesh } from './abstract/meshes';
import { Pane } from 'tweakpane';
// import { OBJLoader } from './loaders/OBJLoader';

export default function main(pane?: Pane) {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl', { powerPreference: "high-performance" });

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const meshes: Mesh[] = [new Plane(),]

    const redVertexShader = glsl`
        attribute vec4 aPosition;
        attribute vec4 aVertexColor;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying lowp vec4 vColor;

        void main(void) {
            vColor = aVertexColor;
            gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
        }
    `;

    const redFragmentShader = glsl`
        varying lowp vec4 vColor;

        void main(void) {
            // gl_FragColor = vColor;
            gl_FragColor = vec4(vec3(1.,0.,0.),1.);
        }
    `;

    const redProgram: WebGLProgram = getShaderProgram(gl, redVertexShader, redFragmentShader)

    const textureVertexShader = glsl`
        attribute vec4 aPosition;
        attribute vec4 aVertexColor;
        attribute vec2 aUv;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        varying vec2 vUv;

        void main(void) {
            vUv = aUv;
            gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
        }
    `;

    const textureFragmentShader = glsl`
        precision mediump float;

        uniform sampler2D uTexture;

        varying vec2 vUv;

        void main(void) {
            // gl_FragColor = vColor;
            gl_FragColor = texture2D(uTexture, vUv);
        }
    `;

    const textureProgram: WebGLProgram = getShaderProgram(gl, textureVertexShader, textureFragmentShader)

    const locations: Locations = {
        attributes: {
            vertexPosition: gl.getAttribLocation(redProgram, 'aPosition'),
            // vertexColor: gl.getAttribLocation(program, 'aVertexColor'),
            texture: gl.getAttribLocation(textureProgram, 'aUv')
        },
        uniforms: {
            projectionMatrix: gl.getUniformLocation(redProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(redProgram, 'uModelViewMatrix'),
            texture: gl.getAttribLocation(textureProgram, 'uTexture')
        }
    }
    const buffers: Buffers = initBuffers(gl, meshes);
    // const loader = new OBJLoader()
    // const content = loader.load('assets/models/cuboid.obj')
    // content.then((value) => {
    //     console.log(loader.parse(value))
    // })

    const PARAMS: Parameters = { rotation: 0.0 }
    if (pane) tweaks(pane, PARAMS)

    let then = 0;
    function render(now: number) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        drawScene(canvas, gl, redProgram, locations, buffers, meshes, PARAMS, deltaTime, pane);

        if (pane) pane.refresh()

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

function tweaks(pane: Pane & any /* broken type ? */, params: Parameters) {
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

    const modelMatrix = mat4.create();

    mat4.scale(modelMatrix, modelMatrix, [1, 1, 1])
    mat4.translate(modelMatrix,
        modelMatrix,
        [-0.0, 0.0, -15.0]);
    mat4.rotate(modelMatrix,
        modelMatrix,
        PARAMS.rotation,     // amount to rotate in radians
        [0, 0, 1]);       // axis to rotate around (Z)
    mat4.rotate(modelMatrix,  // destination matrix
        modelMatrix,
        PARAMS.rotation * .7,// amount to rotate in radians
        [0, 1, 0]);       // axis to rotate around (X)

    gl.useProgram(program);

    // Set shader uniforms
    gl.uniformMatrix4fv(
        locations.uniforms.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        locations.uniforms.modelViewMatrix,
        false,
        modelMatrix);

    for (const positionBuffer of buffers.position) {
        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute
        const index = locations.attributes.vertexPosition as number
        const numComponents = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
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
        for (const colorBuffer of buffers.color) {
            // Tell WebGL how to pull out the colors from the color buffer
            // into the vertexColor attribute.
            {
                const index = locations.attributes.vertexColor as number
                const numComponents = 4;
                const type = gl.FLOAT;
                const normalize = false;
                const stride = 0;
                const offset = 0;
                gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
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
    }

    for (const indexBuffer of buffers.index) {
        // Tell WebGL which indices to use to index the vertices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    }

    // Draw
    for (const mesh of meshes) {
        const vertexCount = mesh.vertices.length / (mesh.vertices.length / mesh.indices.length);
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // PARAMS.rotation += deltaTime;
}

