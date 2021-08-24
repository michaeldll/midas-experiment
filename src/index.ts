import { ready } from "./utils/";
import Desenhador from "./desenha/renderer"
import { fetchShaders, getShaderProgram } from "./desenha/utils";
import { Mesh } from "./desenha/abstract/mesh";
import Generic from "./desenha/meshes/generic"
import Cube from "./desenha/meshes/cube"
import Plane from "./desenha/meshes/plane"
import OBJLoader from "./desenha/loaders/OBJLoader"

const init = () => {
    const renderer = new Desenhador()

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

    const meshes: Mesh[] = []

    Promise.all([shadedShaders, texturedShaders, basicShaders]).then((shaders) => {
        const [shadedShaders, texelShaders, basicShaders] = shaders

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
                program: getShaderProgram(renderer.gl, shadedShaders.vertex, shadedShaders.fragment),
                locationNames: {
                    attributes: ['aPosition', 'aNormal'],
                    uniforms: [
                        'uProjectionMatrix',
                        'uModelMatrix',
                        'uLightColor',
                        'uLightDirection',
                        'uBaseColor',
                        'uAmbientLight',
                    ]
                },
                parameters: loadedMeshParams,
                geometry,
                gl: renderer.gl
            })

            const setLights = (mesh: Mesh, deltaTime: number) => {
                // Base color
                renderer.gl.uniform3f(mesh.locations.uniforms.uBaseColor, 1, 1, 1);

                // Diffuse light color
                renderer.gl.uniform3f(mesh.locations.uniforms.uLightColor, 0.8, 0.8, 0.8);

                // Ambient light color
                renderer.gl.uniform3f(mesh.locations.uniforms.uAmbientLight, 0.1, 0.1, 0.1);

                // Light direction
                renderer.gl.uniform3f(mesh.locations.uniforms.uLightDirection, 0, -1, 1);

                mesh.rotation.x += deltaTime
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
            program: getShaderProgram(renderer.gl, texelShaders.vertex, texelShaders.fragment),
            locationNames: {
                attributes: ['aPosition', 'aUv'],
                uniforms: ['uProjectionMatrix', 'uModelMatrix', 'uTexture']
            },
            parameters: planeParams,
            gl: renderer.gl
        })
        plane.loadTexture(renderer.gl, './assets/textures/cade.jpg')
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
            program: getShaderProgram(renderer.gl, basicShaders.vertex, basicShaders.fragment),
            locationNames: {
                attributes: ['aPosition'],
                uniforms: ['uProjectionMatrix', 'uModelMatrix']
            },
            parameters: cubeParams,
            gl: renderer.gl
        })
        cube.addOnDrawCallback((mesh: Mesh, deltaTime: number) => {
            mesh.rotation.x += deltaTime * 0.5
            mesh.rotation.y += deltaTime
        })
        meshes.push(cube)
    })

    let then = 0;
    function render(now: number) {
        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;

        renderer.drawScene(meshes, deltaTime);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

ready(init)