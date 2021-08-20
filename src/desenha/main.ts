import { resizeCanvasToDisplaySize, getShaderProgram, fetchShaders } from './utils/'
import Plane from './meshes/plane';
import Cube from './meshes/cube';
import { Parameters } from './types';
import { Mesh } from './abstract/mesh';
import { Pane } from 'tweakpane';
import { OBJLoader } from './loaders/OBJLoader';

export default function main(pane?: Pane) {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl', { powerPreference: "high-performance" });

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const meshes: Mesh[] = [new Plane()]

    fetchShaders('./assets/shaders/texel/vertex.glsl', './assets/shaders/texel/fragment.glsl').then(({ vertex, fragment }) => {
        for (const mesh of meshes) {
            mesh.program = getShaderProgram(gl, vertex, fragment)
            mesh.setLocations(gl)
            mesh.loadTexture(gl, './assets/textures/cade.jpg')
            mesh.setBuffers(gl)
        }

        const loader = new OBJLoader()
        const content = loader.load('assets/models/cuboid.obj')
        content.then((value) => {
            console.log(loader.parse(value))
        })

        const PARAMS: Parameters = { rotation: 0.0 }
        if (pane) tweaks(pane, PARAMS)

        let then = 0;
        function render(now: number) {
            now *= 0.001;  // convert to seconds
            const deltaTime = now - then;
            then = now;

            drawScene(canvas, gl, meshes, PARAMS, deltaTime, pane);

            if (pane) pane.refresh()

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    })
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

function drawScene(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, meshes: Mesh[], PARAMS: Parameters, deltaTime: number, pane?: Pane) {
    resizeCanvasToDisplaySize(canvas, window.devicePixelRatio)

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    for (const mesh of meshes) {
        gl.useProgram(mesh.program);

        mesh.calcMatrixes(gl, PARAMS.rotation)

        mesh.getAttributesFromBuffers(gl)

        // Draw
        {
            const vertexCount = mesh.geometry.vertices.length / (mesh.geometry.vertices.length / mesh.geometry.indices.length);
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }
    }

    //PARAMS.rotation += deltaTime;
}

