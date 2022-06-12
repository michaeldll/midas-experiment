/* eslint-disable array-callback-return */
//Howler for sound
import { Howl, Howler } from 'howler'

//GSAP for interpolation
import gsap from 'gsap'

//Babylon for 3D
import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3, Color4, Color3 } from '@babylonjs/core/Maths/math'
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera'
import { DeviceOrientationCamera } from '@babylonjs/core/Cameras/deviceOrientationCamera'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'
import { Mesh } from '@babylonjs/core/Meshes'
import { StandardMaterial } from '@babylonjs/core/Materials'
import { Texture } from '@babylonjs/core'

// Required side effects to populate the SceneLoader class
import '@babylonjs/loaders/glTF'

// Inspector
import '@babylonjs/inspector'

//Custom classes
import Screen from './Screen'
import LoadingScreen from './LoadingScreen'
import Skybox from './Skybox'
import PhysicsController from './PhysicsController'
import EventsController from './EventsController'
import SubtitleController from './SubtitleController'
import ProgressionController from './ProgressionController'
import GizmoController from './GizmoController'

// Utilities
import d2r from '../utils/d2r.js.js'
import config from '../utils/config'
import limitCamera from '../utils/limitCamera'
import showScreen from '../utils/showScreen'
import findMesh from '../utils/findMesh'

//Assets
import birds from '../../../assets/audio/birds4.mp3'
import pensa from '../../../assets/audio/voices/pensa.mp3'
import toca from '../../../assets/audio/voices/toca.mp3'
import horslesmurs from '../../../assets/audio/voices/horslesmurs.mp3'
import portfolio from '../../../assets/audio/voices/portfolio.mp3'
import fleuve from '../../../assets/audio/voices/river.mp3'
import sfx_click_in from '../../../assets/audio/click_in.mp3'
import sfx_click_out from '../../../assets/audio/click_out.mp3'
import sfx_phone_1 from '../../../assets/audio/sfx_phone_1.mp3'
import sfx_phone_2 from '../../../assets/audio/sfx_phone_2.mp3'
import sfx_phone_3 from '../../../assets/audio/sfx_phone_3.mp3'
import sfx_keyboard from '../../../assets/audio/kbclick.mp3'
import sfx_mouse from '../../../assets/audio/mouseclick.mp3'
import forgetting_this from '../../../assets/audio/voices/forgetting_this.mp3'
import how_does_mouse from '../../../assets/audio/voices/how_does_mouse.mp3'

class BabylonScene {
    constructor() {
        this.camera = null
        this.audio = {
            ambient: {
                birds: new Howl({
                    src: birds,
                    loop: true,
                    volume: 0.7,
                }),
            },
            sfx: {
                phoneCollision1: new Howl({
                    src: sfx_phone_1,
                    loop: false,
                    volume: 0.15,
                }),
                phoneCollision2: new Howl({
                    src: sfx_phone_2,
                    loop: false,
                    volume: 0.15,
                }),
                phoneCollision3: new Howl({
                    src: sfx_phone_3,
                    loop: false,
                    volume: 0.15,
                }),
                click_in: new Howl({
                    src: sfx_click_in,
                    loop: false,
                    volume: 0.6,
                    rate: 0.9,
                }),
                click_out: new Howl({
                    src: sfx_click_out,
                    loop: false,
                    volume: 0.6,
                    rate: 0.9,
                }),
                kb: new Howl({
                    src: sfx_keyboard,
                    loop: false,
                    volume: 0.1,
                    rate: 0.8,
                }),
                mouse: new Howl({
                    src: sfx_mouse,
                    loop: false,
                    volume: 0.1,
                }),
            },
            voices: {
                pensa: new Howl({
                    src: pensa,
                    loop: false,
                    volume: 1.9,
                }),
                portfolio: new Howl({
                    src: portfolio,
                    loop: false,
                    volume: 2.8,
                }),
                toca: new Howl({
                    src: toca,
                    loop: false,
                    volume: 2.8,
                }),
                horslesmurs: new Howl({
                    src: horslesmurs,
                    loop: false,
                    volume: 2.8,
                }),
                river: new Howl({
                    src: fleuve,
                    loop: false,
                    volume: 3.1,
                }),
                keepforgetting: new Howl({
                    src: forgetting_this,
                    loop: false,
                    volume: 0.5,
                }),
                howdoesmouse: new Howl({
                    src: how_does_mouse,
                    loop: false,
                    volume: 0.5,
                }),
            },
        }
        this.subtitleControllers = {
            pensa: new SubtitleController('pensa-sub', 10500, [0, 3800]),
            toca: new SubtitleController('toca-sub', 13300, [0]),
            horslesmurs: new SubtitleController('horslesmurs-sub', 39000, [
                0,
                11500,
                20000,
                27000,
            ]),
            river: new SubtitleController('river-sub', 19000, [0, 11500]),
            portfolio: new SubtitleController('postit-sub', 3500, [0]),
            keepforgetting: new SubtitleController('keepforgetting-sub', 2200, [
                0,
            ]),
            howdoesmouse: new SubtitleController('howdoesmouse-sub', 2500, [0]),
        }
        this.hasClickedMouse = false
        this.overlayTimeline = gsap.timeline({ repeat: -1, yoyo: true })
        this.canvas = null
        this.scene = null
        this.engine = null
        this.EventsController = null
        this.PhysicsController = null
        this.ProgressionController = null
        this.loadingScreen = new LoadingScreen().init()
        this.isMobile = sessionStorage.getItem('USER_HAS_TOUCHED')
    }

    init() {
        // Set the canvas element.
        document
            .querySelector('#canvas-container')
            .insertAdjacentHTML(
                'afterbegin',
                '<canvas id="babylon-canvas"></canvas>'
            )
        this.canvas = document.getElementById('babylon-canvas')

        // Associate a Babylon Engine to it.
        this.engine = new Engine(this.canvas, false, null, true)
        window.innerWidth > 450
            ? this.engine.setHardwareScalingLevel(window.innerWidth / 480)
            : this.engine.setHardwareScalingLevel(2.2)
        this.engine.displayLoadingUI()

        // Create a scene.
        this.scene = new Scene(this.engine)

        SceneLoader.Load(
            'models/',
            'scene_final_old.glb',
            this.engine,
            (gltf) => {
                this.scene = gltf

                new Skybox(this.scene, 3).init()

                if (this.isMobile) {
                    new Screen(
                        this.scene,
                        document.getElementById('horslesmurs'),
                        'horsLesMursScreen'
                    ).init()
                    new Screen(
                        this.scene,
                        document.getElementById('pensa'),
                        'pensaScreen'
                    ).init()
                } else {
                    new Screen(
                        this.scene,
                        document.getElementById('life-river'),
                        'riverScreen'
                    ).init()
                    new Screen(
                        this.scene,
                        document.getElementById('horslesmurs'),
                        'horsLesMursScreen'
                    ).init()
                    new Screen(
                        this.scene,
                        document.getElementById('toca'),
                        'tocaScreen'
                    ).init()
                    new Screen(
                        this.scene,
                        document.getElementById('pensa'),
                        'pensaScreen'
                    ).init()
                }

                this.setPhone()
                this.setCamera()
                this.setTutorialFilterMesh()
                this.setArm()
                this.setHoverHighlights()
                this.setPostits()
                showScreen(this.scene, 'random')

                if (sessionStorage.getItem('volume')) {
                    Howler.volume(parseInt(sessionStorage.getItem('volume')))
                } else {
                    sessionStorage.setItem('volume', '1')
                }

                //ambient sound
                this.audio.ambient.birds.play()

                this.PhysicsController = new PhysicsController(
                    this.scene,
                    this.audio
                )

                this.PhysicsController.init()

                this.ProgressionController = new ProgressionController(
                    this.scene
                )

                this.EventsController = new EventsController(
                    this.canvas,
                    this.scene,
                    this.engine,
                    this.audio,
                    this.subtitleControllers,
                    this.ProgressionController,
                    this.PhysicsController,
                    this.overlayTimeline
                )

                setTimeout(() => {
                    setTimeout(() => {
                        // if (!localStorage.getItem('hasSeenBeginningPostit')) {
                        //     localStorage.setItem('hasSeenBeginningPostit', '1')
                        //     this.EventsController.startTutorial('facingScreen')
                        // }

                        if (!sessionStorage.getItem('hasGrabbedPostitStack')) {
                            this.scene.meshes
                                .filter(
                                    (mesh) => mesh.name.indexOf('tuto') > -1
                                )
                                .forEach((postit) => {
                                    postit.renderOverlay = true
                                    postit.outlineWidth = 0.002
                                    this.overlayTimeline.fromTo(
                                        postit,
                                        { overlayAlpha: 0 },
                                        { overlayAlpha: 1, duration: 1 }
                                    )
                                })
                        }
                    }, 150)
                }, 1000)

                if (config.debug) {
                    document.getElementById('canvas-container').style.width =
                        '100%'
                    document.querySelector('.discover').classList.add('hide')
                    document.querySelector('.backtomenu').classList.add('hide')
                    document
                        .querySelector('.logo-container')
                        .classList.add('hide')
                    this.scene.debugLayer.show()
                    new GizmoController(
                        this.scene,
                        findMesh('phone', this.scene)
                    ).init()
                    this.scene.forceShowBoundingBoxes = true
                }

                this.scene.beforeRender = () => {
                    if (this.camera) this.rotateArm()
                    if (this.EventsController)
                        this.EventsController.onCameraRotation()
                    if (this.camera)
                        limitCamera(
                            this.camera,
                            { lower: -0.22, upper: 0.52 },
                            'x'
                        )
                    if (this.camera)
                        limitCamera(
                            this.camera,
                            { lower: -0.55, upper: 0.55 },
                            'y'
                        )
                }

                // Render every frame
                this.engine.runRenderLoop(() => {
                    this.scene.render()
                })
            },
            (progressEvent) => {
                let loadedPercent = 0
                if (progressEvent.lengthComputable) {
                    loadedPercent = (
                        (progressEvent.loaded * 100) /
                        progressEvent.total
                    ).toFixed()
                } else {
                    const dlCount = progressEvent.loaded / (1024 * 1024)
                    loadedPercent = Math.floor(dlCount * 100.0) / 100.0
                }
                document.getElementById('loading-bar').style.width =
                    loadedPercent * 38.9105058366 + '%'
            }
        )
    }

    setTutorialFilterMesh() {
        const filter = Mesh.CreateBox('blackTutorialFilter', 1.5, this.scene)
        filter.isPickable = false
        const transMat = new StandardMaterial('transparent', this.scene)
        transMat.alpha = 0.5
        filter.material = transMat
        filter.position = new Vector3(
            this.camera.position.x,
            this.camera.position.y,
            -0.267
        )
        filter.setEnabled(false)
    }

    setHoverHighlights() {
        this.scene.meshes.forEach((mesh) => {
            mesh.edgesWidth = 0.9
            mesh.edgesColor = new Color4(249 / 255, 213 / 255, 134 / 255, 1)
            mesh.outlineColor = new Color3(249 / 255, 213 / 255, 134 / 255)
            mesh.overlayColor = new Color3(59 / 255, 99 / 255, 173 / 255)
            mesh.overlayAlpha = 1
        })

        findMesh('MOUSE', this.scene).outlineWidth = 0.005
        findMesh('phone', this.scene).outlineWidth = 0.006

        this.scene.meshes
            .filter((mesh) => mesh.name.indexOf('Screen') > -1)
            .forEach((screen) => {
                screen.outlineWidth = 0.034
            })
    }

    setPhone() {
        const phone = findMesh('phone', this.scene)
        const phoneInHand = findMesh('phone.child', this.scene)

        phoneInHand.setEnabled(false)

        phone.scaling = new Vector3(0.5, 0.5, 0.5)
        phone.setParent(null)

        phone.position = new Vector3(
            config.phone.position.x,
            config.phone.position.y,
            config.phone.position.z
        )
        phone.rotation = new Vector3(
            config.phone.rotation.x,
            config.phone.rotation.y,
            config.phone.rotation.z
        )
    }

    setCamera() {
        const cameraPos = new Vector3(
            config.camera.position.x,
            config.camera.position.y,
            config.camera.position.z
        )
        const cameraTarget = new Vector3(
            config.camera.target.x,
            config.camera.target.y,
            config.camera.target.z
        )
        if (sessionStorage.getItem('USER_HAS_TOUCHED')) {
            this.camera = new DeviceOrientationCamera(
                'camera1',
                cameraPos,
                this.scene
            )
        } else {
            this.camera = new UniversalCamera('camera1', cameraPos, this.scene)
        }
        this.camera.minZ = config.camera.near
        this.camera.fov = sessionStorage.getItem('USER_HAS_TOUCHED')
            ? d2r(config.camera.fovMobile)
            : d2r(config.camera.fov)
        this.camera.setTarget(cameraTarget)
        this.camera.attachControl(this.canvas, true)
        this.camera.speed = config.camera.speed
        this.camera.inertia = config.camera.inertia
    }

    setArm() {
        const arm = this.scene.rootNodes[0]._children.find((child) => {
            if (child.name === 'main_enfant.004') return child
        })
        arm.position.x = config.arm.initial.position.x
        arm.position.y = config.arm.initial.position.y
        arm.position.z = config.arm.initial.position.z
        arm.scaling = new Vector3(0.5, 0.5, 0.5)
    }

    setPostits() {
        this.scene.meshes
            .filter((mesh) => mesh.name.indexOf('hand.postit') > -1)
            .forEach((handPostit) => {
                handPostit.material.albedoTexture = new Texture(
                    'textures/post-it-tutorial.png',
                    this.scene
                )
                handPostit.material.albedoTexture.vAng = d2r(180)
                handPostit.material.albedoTexture.wAng = d2r(180)
                handPostit.material._unlit = true
                handPostit.setEnabled(false)
            })
    }

    rotateArm() {
        const arm = this.scene.rootNodes[0]._children.find((child) => {
            if (child.name === 'main_enfant.004') return child
        })
        arm.rotation = new Vector3(
            this.camera.rotation.x,
            -this.camera.rotation.y,
            this.camera.rotation.z
        )
    }
}

export default BabylonScene
