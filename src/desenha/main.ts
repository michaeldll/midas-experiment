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

    const texelShaders = fetchShaders(
        './assets/shaders/texel/vertex.glsl',
        './assets/shaders/texel/fragment.glsl',
    )

    const basicShaders = fetchShaders(
        './assets/shaders/basic/vertex.glsl',
        './assets/shaders/basic/fragment.glsl',
    )

    Promise.all([texelShaders, basicShaders])
        .then((shaders) => {
            const [texelShaders, basicShaders] = shaders

            // Textured Plane
            const plane = new Plane({
                program: getShaderProgram(gl, texelShaders.vertex, texelShaders.fragment),
            })
            plane.locations = {
                attributes: {
                    position: gl.getAttribLocation(plane.program, 'aPosition'),
                    uv: gl.getAttribLocation(plane.program, 'aUv')
                },
                uniforms: {
                    projectionMatrix: gl.getUniformLocation(plane.program, 'uProjectionMatrix'),
                    modelViewMatrix: gl.getUniformLocation(plane.program, 'uModelViewMatrix'),
                    texture: gl.getUniformLocation(plane.program, 'uTexture')
                }
            }
            plane.readyToRender = false
            plane.loadTexture(gl, './assets/textures/cade.jpg').then(() => {
                plane.setBuffers(gl)
                plane.readyToRender = true
            })
            const planeParams: Parameters = {
                translation: { x: 2, y: 0, z: -10 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 }
            }
            plane.position = planeParams.translation
            plane.rotation = planeParams.rotation
            plane.scale = planeParams.scale

            // Red Cube
            const cube = new Cube({
                program: getShaderProgram(gl, basicShaders.vertex, basicShaders.fragment)
            })
            gl.useProgram(cube.program);
            cube.locations = {
                attributes: {
                    position: gl.getAttribLocation(cube.program, 'aPosition'),
                },
                uniforms: {
                    projectionMatrix: gl.getUniformLocation(cube.program, 'uProjectionMatrix'),
                    modelViewMatrix: gl.getUniformLocation(cube.program, 'uModelViewMatrix'),
                }
            }
            cube.setBuffers(gl)
            const cubeParams: Parameters = {
                translation: { x: -2, y: 0, z: -10 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 }
            }
            cube.position = cubeParams.translation
            cube.rotation = cubeParams.rotation
            cube.scale = cubeParams.scale

            const meshes: Mesh[] = [cube, plane]

            let then = 0;
            function render(now: number) {
                requestAnimationFrame(render);

                now *= 0.001;  // convert to seconds
                const deltaTime = now - then;
                then = now;

                drawScene(canvas, gl, meshes, deltaTime, pane);

                // if (pane) pane.refresh()

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
        if (!mesh.readyToRender) return

        gl.useProgram(mesh.program);

        mesh.calcMatrixes(gl)

        mesh.getAttributesFromBuffers(gl)

        // Draw
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.buffers.indices);
        {
            const vertexCount = mesh.geometry.vertices.length / (mesh.geometry.vertices.length / mesh.geometry.indices.length);
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
        }

        mesh.rotation.x += deltaTime;
    }
}


// const loader = new OBJLoader()
// const content = loader.load('assets/models/cuboid.obj')
// content.then((value) => {
//     console.log(loader.parse(value))
// })

// if (pane) {
//     pane.addInput(planeParams, 'translation')
//     pane.addInput(planeParams, 'rotation')
//     pane.addInput(planeParams, 'scale')
// }