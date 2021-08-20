import { resizeCanvasToDisplaySize, getShaderProgram, fetchShaders } from './utils/'
import Plane from './meshes/plane';
import Cube from './meshes/cube';
import { Parameters } from './types';
import { Mesh } from './abstract/mesh';
import { Pane } from 'tweakpane';
// import { OBJLoader } from './loaders/OBJLoader';

export default function main(pane?: Pane & any) {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl', { powerPreference: "high-performance" });

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const meshes: Mesh[] = [new Cube()]

    fetchShaders('./assets/shaders/texel/vertex.glsl', './assets/shaders/texel/fragment.glsl').then(({ vertex, fragment }) => {
        for (const mesh of meshes) {
            mesh.program = getShaderProgram(gl, vertex, fragment)
            mesh.setLocations(gl)
            mesh.loadTexture(gl, './assets/textures/cade.jpg')
            mesh.setBuffers(gl)
        }

        const planeParams: Parameters = {
            translation: { x: 0, y: 0, z: -2 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 }
        }
        if (pane) {
            pane.addInput(planeParams, 'translation')
            pane.addInput(planeParams, 'rotation')
            pane.addInput(planeParams, 'scale')
        }
        meshes[0].position = planeParams.translation
        meshes[0].rotation = planeParams.rotation
        meshes[0].scale = planeParams.scale

        // const cubeParams: Parameters = {
        //     translation: { x: 0, y: 0, z: -2 },
        //     rotation: { x: 0, y: 0, z: 0 },
        //     scale: { x: 1, y: 1, z: 1 }
        // }
        // if (pane) {
        //     pane.addInput(cubeParams, 'translation')
        //     pane.addInput(cubeParams, 'rotation')
        //     pane.addInput(cubeParams, 'scale')
        // }
        // meshes[1].position = cubeParams.translation
        // meshes[1].rotation = cubeParams.rotation
        // meshes[1].scale = cubeParams.scale

        // const loader = new OBJLoader()
        // const content = loader.load('assets/models/cuboid.obj')
        // content.then((value) => {
        //     console.log(loader.parse(value))
        // })

        let then = 0;
        function render(now: number) {
            now *= 0.001;  // convert to seconds
            const deltaTime = now - then;
            then = now;

            drawScene(canvas, gl, meshes, deltaTime, pane);

            if (pane) pane.refresh()

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    })
}

function drawScene(canvas: HTMLCanvasElement, gl: WebGLRenderingContext, meshes: Mesh[], deltaTime: number, pane?: Pane) {
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

        mesh.calcMatrixes(gl)

        mesh.getAttributesFromBuffers(gl)

        // Draw
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.buffers.indices);
        {
            const vertexCount = mesh.geometry.vertices.length / (mesh.geometry.vertices.length / mesh.geometry.indices.length);
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.LINE_STRIP, vertexCount, type, offset);
        }

        mesh.rotation.x += deltaTime;
    }
}

