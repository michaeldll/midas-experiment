import { resizeCanvasToDisplaySize, getShaderProgram, fetchShaders } from './utils/'
import Plane from './meshes/plane';
import Cube from './meshes/cube';
import { Mesh } from './abstract/mesh';
import { Pane } from 'tweakpane';
import { OBJLoader } from './loaders/OBJLoader';
import Generic from './meshes/generic';
import { Geometry } from './types';
import { mat4 } from 'gl-matrix';

export default function main(pane?: Pane & any) {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl', { powerPreference: "high-performance" });

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    const shadedShaders = fetchShaders(
        './assets/shaders/shaded/vertex.glsl',
        './assets/shaders/shaded/fragment.glsl',
    )

    const texturedShaders = fetchShaders(
        './assets/shaders/texel/vertex.glsl',
        './assets/shaders/texel/fragment.glsl',
    )

    const basicShaders = fetchShaders(
        './assets/shaders/basic/vertex.glsl',
        './assets/shaders/basic/fragment.glsl',
    )

    Promise.all([shadedShaders, texturedShaders, basicShaders])
        .then((shaders) => {
            const [shadedShaders, texelShaders, basicShaders] = shaders

            const meshes: Mesh[] = []

            // Monitor
            const loader = new OBJLoader()
            loader.load('assets/models/monitor.obj').then((geometry) => {
                const loadedMeshParams = {
                    translation: { x: 0, y: 0.5, z: -3 },
                    rotation: { x: 0, y: 0, z: 0 },
                    scale: { x: 1.1, y: 1.1, z: 1.1 }
                }
                const loadedMesh = new Generic({
                    name: 'monitor',
                    program: getShaderProgram(gl, shadedShaders.vertex, shadedShaders.fragment),
                    locationNames: {
                        attributes: ['aPosition', 'aNormal'],
                        uniforms: ['uProjectionMatrix', 'uModelViewMatrix', 'uLightColor', 'uLightDirection', 'uBaseColor', 'uAmbientLight']
                    },
                    parameters: loadedMeshParams,
                    geometry,
                    gl
                })

                const setLights = (mesh: Mesh, deltaTime: number) => {
                    // Base color
                    gl.uniform3f(mesh.locations.uniforms.uBaseColor, 1, 0, 1);

                    // Diffuse light color
                    gl.uniform3f(mesh.locations.uniforms.uLightColor, 0.8, 0.8, 0.8);

                    // Ambient light color
                    gl.uniform3f(mesh.locations.uniforms.uAmbientLight, 0.1, 0.1, 0.1);

                    // Light direction
                    gl.uniform3f(mesh.locations.uniforms.uLightDirection, -2, -1, 1);

                    mesh.rotation.y += deltaTime
                }
                loadedMesh.addOnDrawCallback(setLights)

                meshes.push(loadedMesh)
            })

            // Textured Plane
            const planeParams = {
                translation: { x: 2, y: -0.5, z: -10 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 }
            }
            const plane = new Plane({
                name: 'textured plane',
                program: getShaderProgram(gl, texelShaders.vertex, texelShaders.fragment),
                locationNames: {
                    attributes: ['aPosition', 'aUv'],
                    uniforms: ['uProjectionMatrix', 'uModelViewMatrix', 'uTexture']
                },
                parameters: planeParams,
                gl
            })
            plane.loadTexture(gl, './assets/textures/cade.jpg')
            plane.addOnDrawCallback((mesh: Mesh, deltaTime: number) => {
                mesh.rotation.y += deltaTime
            })
            meshes.push(plane)

            // Red Cube
            const cubeParams = {
                translation: { x: -2, y: -0.5, z: -10 },
                rotation: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 }
            }
            const cube = new Cube({
                name: 'red cube',
                program: getShaderProgram(gl, basicShaders.vertex, basicShaders.fragment),
                locationNames: {
                    attributes: ['aPosition'],
                    uniforms: ['uProjectionMatrix', 'uModelViewMatrix']
                },
                parameters: cubeParams,
                gl
            })
            cube.addOnDrawCallback((mesh: Mesh, deltaTime: number) => {
                mesh.rotation.x += deltaTime * 0.5
                mesh.rotation.y += deltaTime
            })
            meshes.push(cube)

            let then = 0;
            function render(now: number) {
                now *= 0.001;  // convert to seconds
                const deltaTime = now - then;
                then = now;

                drawScene(canvas, gl, meshes, deltaTime, pane);

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
        if (!mesh.readyToRender) return

        gl.useProgram(mesh.program);

        mesh.calcMatrixes(gl)

        mesh.getAttributesFromBuffers(gl)

        mesh.draw(gl, gl.TRIANGLES, deltaTime)
    }
}




// if (pane) {
//     pane.addInput(planeParams, 'translation')
//     pane.addInput(planeParams, 'rotation')
//     pane.addInput(planeParams, 'scale')
// }