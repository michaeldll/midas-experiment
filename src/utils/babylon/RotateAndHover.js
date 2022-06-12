import {
    Engine,
    Scene,
    SceneLoader,
    Color3,
    Color4,
    Vector3,
    StandardMaterial,
    ExecuteCodeAction,
    ActionManager,
    ArcRotateCamera,
    HemisphericLight,
} from 'babylonjs'
import 'babylonjs-loaders'
import d2r from '~/utils/d2r'
import gsap from 'gsap'

export default class MainScene {
    constructor({ canvas, withTable }) {
        this.canvas = canvas
        this.withTable = withTable
    }

    init = () => {
        // Load the 3D engine
        this.engine = new Engine(this.canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
        })

        // Creates and return the scene
        this.scene = this.setScene()

        // this.scene.debugLayer.show()

        // run the render loop
        this.engine.runRenderLoop(this.update)

        // the this.canvas/window resize event handler
        window.addEventListener('resize', () => {
            this.engine.resize()
        })
    }

    update = () => {
        this.scene.meshes.forEach((mesh) => {
            if (this.withTable) {
                if (mesh.name.indexOf('table') > -1) {
                    gsap.to(mesh.rotation, 0.2, {
                        y: -Math.PI / 2 + Math.sin(window.scrollPosition) * 0.6,
                    })
                }
            } else {
                if (mesh.name.indexOf('1106-Ekaterinensky-Park-Seneca.002') > -1) {
                    gsap.to(mesh.rotation, 0.2, {
                        y: -Math.PI / 2 + Math.sin(window.scrollPosition * 0.002) * 0.3,
                    })
                }
            }

            if (mesh.name.indexOf('SubTool') > -1) {
                gsap.to(mesh.rotation, 0.2, {
                    y: -Math.PI / 2 + Math.sin(window.scrollPosition * 0.002) * 0.3,
                })
            }
        })
        this.scene.render()
    }

    setScene = () => {
        // Create a basic BJS Scene object
        const scene = new Scene(this.engine)
        scene.clearColor = new Color4(0, 0, 0, 0)

        // Create a FreeCamera, and set its position to {x: 0, y: 5, z: -10}
        const camera = new ArcRotateCamera(
            'camera1',
            0,
            0,
            14,
            new Vector3(0, 0, 0),
            scene
        )
        camera.minZ = 0.01 // how close does the camera clip
        camera.panningAxis = new Vector3(1, 0, 1) // make the pan move along the ground
        // camera.panningSensibility = 0 // how fast can you move 0 = no panning
        camera.allowUpsideDown = false // don't allow inversing camera
        camera.lowerRadiusLimit = this.withTable ? 3 : 14 // how far in can you zoom
        camera.upperRadiusLimit = this.withTable ? 3 : 14 // how far out can you zoom
        camera.lowerBetaLimit = 0.5 // how for up can you move the camera
        camera.upperBetaLimit = Math.PI / 2.2 // how low down can you move the camera
        camera.alpha = d2r(this.withTable ? 170 : 0)
        camera.beta = d2r(this.withTable ? 80 : 90)
        // Attach the camera to the this.canvas
        camera.attachControl(this.canvas, false)
        camera.inputs.remove(camera.inputs.attached.mousewheel)
        camera.inputs.remove(camera.inputs.attached.keyboard)

        const light = new HemisphericLight('light1', new Vector3(1, 2, 1), scene)
        light.intensity = 1.13
        light.diffuse = new Color3(229 / 255, 216 / 255, 198 / 255)
        // 229, 216, 198
        SceneLoader.Append(
            '/',
            // `models/seneca${this.withTable ? '_table' : '-light'}.glb`,
            // `models/1106-Ekaterinensky-Park-Seneca.002.glb`,
            `models/marc-light.glb`,
            scene,
            (scene) => {
                // do something with the scene
                scene.meshes.forEach((mesh) => {
                    if (this.withTable) {
                        if (mesh.name.indexOf('Toto') > -1) {
                        }
                        mesh.actionManager = new ActionManager(scene)
                        mesh.actionManager.registerAction(
                            new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (e) => {
                                document
                                    .querySelector('.citation')
                                    .classList.add('cursor-pointer')
                            })
                        )
                        mesh.actionManager.registerAction(
                            new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (e) => {
                                document
                                    .querySelector('.citation')
                                    .classList.remove('cursor-pointer')
                            })
                        )
                    } else {
                        if (mesh.name.indexOf('1106-Ekaterinensky-Park-Seneca.002') > -1) {
                            mesh.position = new Vector3(0, 0, 0)
                            const material = new StandardMaterial('statue', scene)
                            material.roughness = 0
                            material.specularPower = 100000
                            mesh.material = material
                            // mesh.rotation = new Vector3(d2r(90), 0, 0)
                            mesh.rotation = new Vector3(0, d2r(-90), 0)

                            mesh.actionManager = new ActionManager(scene)
                            mesh.actionManager.registerAction(
                                new ExecuteCodeAction(
                                    ActionManager.OnPointerOverTrigger,
                                    (e) => {
                                        document
                                            .querySelector('.citation')
                                            .classList.add('cursor-pointer')
                                    }
                                )
                            )
                            mesh.actionManager.registerAction(
                                new ExecuteCodeAction(
                                    ActionManager.OnPointerOutTrigger,
                                    (e) => {
                                        document
                                            .querySelector('.citation')
                                            .classList.remove('cursor-pointer')
                                    }
                                )
                            )
                        }
                    }
                    if (mesh.name.indexOf('SubTool') > -1) {
                        mesh.actionManager = new ActionManager(scene)
                        mesh.actionManager.registerAction(
                            new ExecuteCodeAction(ActionManager.OnPointerOverTrigger, (e) => {
                                document
                                    .querySelector('.citation')
                                    .classList.add('cursor-pointer')
                            })
                        )
                        mesh.actionManager.registerAction(
                            new ExecuteCodeAction(ActionManager.OnPointerOutTrigger, (e) => {
                                document
                                    .querySelector('.citation')
                                    .classList.remove('cursor-pointer')
                            })
                        )
                        mesh.position = new Vector3(0, 0, 0)
                        const material = new StandardMaterial('statue', scene)
                        material.roughness = 0
                        material.specularPower = 100000
                        mesh.material = material
                        // mesh.rotation = new Vector3(d2r(90), 0, 0)
                        mesh.rotation = new Vector3(d2r(90), d2r(-90), 0)
                    }
                })
                window.isModelLoaded = true
                window.lmS.update()
            }
        ).showLoadingScreen = false

        // function showWorldAxis(size) {
        //   var makeTextPlane = function (text, color, size) {
        //     var dynamicTexture = new DynamicTexture(
        //       'DynamicTexture',
        //       50,
        //       scene,
        //       true
        //     )
        //     dynamicTexture.hasAlpha = true
        //     dynamicTexture.drawText(
        //       text,
        //       5,
        //       40,
        //       'bold 36px Arial',
        //       color,
        //       'transparent',
        //       true
        //     )
        //     var plane = Mesh.CreatePlane('TextPlane', size, scene, true)
        //     plane.material = new StandardMaterial('TextPlaneMaterial', scene)
        //     plane.material.backFaceCulling = false
        //     plane.material.specularColor = new Color3(0, 0, 0)
        //     plane.material.diffuseTexture = dynamicTexture
        //     return plane
        //   }
        //   var axisX = Mesh.CreateLines(
        //     'axisX',
        //     [
        //       Vector3.Zero(),
        //       new Vector3(size, 0, 0),
        //       new Vector3(size * 0.95, 0.05 * size, 0),
        //       new Vector3(size, 0, 0),
        //       new Vector3(size * 0.95, -0.05 * size, 0),
        //     ],
        //     scene
        //   )
        //   axisX.color = new Color3(1, 0, 0)
        //   var xChar = makeTextPlane('X', 'red', size / 10)
        //   xChar.position = new Vector3(0.9 * size, -0.05 * size, 0)
        //   var axisY = Mesh.CreateLines(
        //     'axisY',
        //     [
        //       Vector3.Zero(),
        //       new Vector3(0, size, 0),
        //       new Vector3(-0.05 * size, size * 0.95, 0),
        //       new Vector3(0, size, 0),
        //       new Vector3(0.05 * size, size * 0.95, 0),
        //     ],
        //     scene
        //   )
        //   axisY.color = new Color3(0, 1, 0)
        //   var yChar = makeTextPlane('Y', 'green', size / 10)
        //   yChar.position = new Vector3(0, 0.9 * size, -0.05 * size)
        //   var axisZ = Mesh.CreateLines(
        //     'axisZ',
        //     [
        //       Vector3.Zero(),
        //       new Vector3(0, 0, size),
        //       new Vector3(0, -0.05 * size, size * 0.95),
        //       new Vector3(0, 0, size),
        //       new Vector3(0, 0.05 * size, size * 0.95),
        //     ],
        //     scene
        //   )
        //   axisZ.color = new Color3(0, 0, 1)
        //   var zChar = makeTextPlane('Z', 'blue', size / 10)
        //   zChar.position = new Vector3(0, 0.05 * size, 0.9 * size)
        // }

        // showWorldAxis(5)

        // Return the created scene
        return scene
    }
}
