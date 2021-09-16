import { ready } from "./utils/";
import Desenhador from "desenha"
import OBJLoader from "desenha/dist/loaders/OBJLoader"
import Generic from "desenha/dist/meshes/generic"
import { fetchShaders } from "desenha/dist/utils/index"
import { Mesh } from "desenha/dist/abstract/mesh";

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

            const setShading = (mesh: Mesh, deltaTime: number) => {
                // Base color
                renderer.gl.uniform3f(mesh.locations.uniforms.uBaseColor, 1, 1, 1);

                // Diffuse light color
                renderer.gl.uniform3f(mesh.locations.uniforms.uLightColor, 2.5, 2.5, 2.5);

                // Ambient light color
                renderer.gl.uniform3f(mesh.locations.uniforms.uAmbientLight, 0.1, 0.1, 0.1);

                // Light direction
                renderer.gl.uniform3f(mesh.locations.uniforms.uLightDirection, 0, -1, 1);
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

        renderer.draw(meshes, deltaTime);

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

ready(init)














// const init = () => {
//     const renderer = new Desenhador()

//     const shadedShaders = fetchShaders(
//         './assets/shaders/shaded/vertex.glsl',
//         './assets/shaders/shaded/fragment.glsl',
//     )

//     const texturedShaders = fetchShaders(
//         './assets/shaders/texel/vertex.glsl',
//         './assets/shaders/texel/fragment.glsl',
//     )

//     const basicShaders = fetchShaders(
//         './assets/shaders/basic/vertex.glsl',
//         './assets/shaders/basic/fragment.glsl',
//     )

//     const meshes: Mesh[] = []

//     Promise.all([shadedShaders, texturedShaders, basicShaders]).then((shaders) => {
//         const [shadedShaders, texelShaders, basicShaders] = shaders

//         // Monitor
//         const loader = new OBJLoader()
//         loader.load('assets/models/monitor.obj').then((geometry) => {
//             const loadedMeshParams = {
//                 translation: { x: 0, y: 0.5, z: -3 },
//                 rotation: { x: 0, y: 0, z: 0 },
//                 scale: { x: 1.1, y: 1.1, z: 1.1 }
//             }
//             const loadedMesh = new Generic({
//                 name: 'monitor',
//                 program: getShaderProgram(renderer.gl, shadedShaders.vertex, shadedShaders.fragment),
//                 locationNames: {
//                     attributes: ['aPosition', 'aNormal'],
//                     uniforms: [
//                         'uProjectionMatrix',
//                         'uModelMatrix',
//                         'uLightColor',
//                         'uLightDirection',
//                         'uBaseColor',
//                         'uAmbientLight',
//                     ]
//                 },
//                 parameters: loadedMeshParams,
//                 geometry,
//                 gl: renderer.gl
//             })

//             const setLights = (mesh: Mesh, deltaTime: number) => {
//                 // Base color
//                 renderer.gl.uniform3f(mesh.locations.uniforms.uBaseColor, 1, 1, 1);

//                 // Diffuse light color
//                 renderer.gl.uniform3f(mesh.locations.uniforms.uLightColor, 0.8, 0.8, 0.8);

//                 // Ambient light color
//                 renderer.gl.uniform3f(mesh.locations.uniforms.uAmbientLight, 0.1, 0.1, 0.1);

//                 // Light direction
//                 renderer.gl.uniform3f(mesh.locations.uniforms.uLightDirection, 0, -1, 1);

//                 mesh.rotation.x += deltaTime
//             }
//             loadedMesh.addOnDrawCallback(setLights)

//             meshes.push(loadedMesh)
//         })

//         // Textured Plane
//         const planeParams = {
//             translation: { x: 2, y: -0.5, z: -10 },
//             rotation: { x: 0, y: 0, z: 0 },
//             scale: { x: 1, y: 1, z: 1 }
//         }
//         const plane = new Plane({
//             name: 'textured plane',
//             program: getShaderProgram(renderer.gl, texelShaders.vertex, texelShaders.fragment),
//             locationNames: {
//                 attributes: ['aPosition', 'aUv'],
//                 uniforms: ['uProjectionMatrix', 'uModelMatrix', 'uTexture']
//             },
//             parameters: planeParams,
//             gl: renderer.gl
//         })
//         plane.loadTexture(renderer.gl, './assets/textures/cade.jpg')
//         plane.addOnDrawCallback((mesh: Mesh, deltaTime: number) => {
//             mesh.rotation.y += deltaTime
//         })
//         meshes.push(plane)

//         // Red Cube
//         const cubeParams = {
//             translation: { x: -2, y: -0.5, z: -10 },
//             rotation: { x: 0, y: 0, z: 0 },
//             scale: { x: 1, y: 1, z: 1 }
//         }
//         const cube = new Cube({
//             name: 'red cube',
//             program: getShaderProgram(renderer.gl, basicShaders.vertex, basicShaders.fragment),
//             locationNames: {
//                 attributes: ['aPosition'],
//                 uniforms: ['uProjectionMatrix', 'uModelMatrix']
//             },
//             parameters: cubeParams,
//             gl: renderer.gl
//         })
//         cube.addOnDrawCallback((mesh: Mesh, deltaTime: number) => {
//             mesh.rotation.x += deltaTime * 0.5
//             mesh.rotation.y += deltaTime
//         })
//         meshes.push(cube)
//     })

//     let then = 0;
//     function update(now: number) {
//         now *= 0.001;  // convert to seconds
//         const deltaTime = now - then;
//         then = now;

//         renderer.drawScene(meshes, deltaTime);

//         requestAnimationFrame(update);
//     }
//     requestAnimationFrame(update);
// }