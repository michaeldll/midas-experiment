import { ready } from "./utils/";
import Desenhador from "desenha"
import OBJLoader from "desenha/dist/loaders/OBJLoader"
import Generic from "desenha/dist/meshes/generic"
import { fetchShaders } from "desenha/dist/utils/index"

const init = () => {
    const renderer = new Desenhador()
    const loader = new OBJLoader()
    const meshes = []

    fetchShaders('./assets/shaders/texturedShaded/vertex.glsl', './assets/shaders/texturedShaded/fragment.glsl').then(({ vertex, fragment }) => {
        loader.load('assets/models/monitor.obj').then((geometry) => {
            const parameters = {
                position: { x: 0, y: 0, z: -1.5 },
                rotation: { x: 0, y: -0.5, z: 0 },
                scale: { x: 1, y: 1, z: 1 }
            }
            const loadedMesh = new Generic({
                name: 'monitor',
                shaders: [vertex, fragment],
                locationNames: {
                    attributes: ['aPosition', 'aNormal', 'aUv'],
                    uniforms: [
                        'uProjectionMatrix',
                        'uModelMatrix',
                        'uLightColor',
                        'uLightDirection',
                        'uBaseColor',
                        'uAmbientLight',
                        'uTexture'
                    ]
                },
                parameters,
                geometry,
                gl: renderer.gl
            })

            const setShading = (mesh, deltaTime) => {
                // Base color
                renderer.gl.uniform3f(mesh.locations.uniforms.uBaseColor, 1, 1, 1);

                // Diffuse light color
                renderer.gl.uniform3f(mesh.locations.uniforms.uLightColor, 2.5, 2.5, 2.5);

                // Ambient light color
                renderer.gl.uniform3f(mesh.locations.uniforms.uAmbientLight, 0.1, 0.1, 0.1);

                // Light direction
                renderer.gl.uniform3f(mesh.locations.uniforms.uLightDirection, 0, -1, 1);

                // mesh.rotation.x += deltaTime
            }
            loadedMesh.addOnDrawCallback(setShading)

            loadedMesh.loadTexture(renderer.gl, './assets/textures/crt_layout.jpg')

            meshes.push(loadedMesh)
        })
    })

    // Render loop
    let then = 0;
    const update = (now: number) => {
        now *= 0.001;  // Convert to seconds
        const deltaTime = now - then;
        then = now;

        renderer.drawScene(meshes, deltaTime);

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

ready(init)