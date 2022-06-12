import { Mesh, MeshBuilder } from '@babylonjs/core/Meshes'
import { StandardMaterial } from '@babylonjs/core/Materials'
import { VideoTexture } from '@babylonjs/core/Materials/Textures'
import { Color3, Vector3 } from '@babylonjs/core/Maths/math'
import d2r from '../utils/d2r'
import config from '../utils/config'
// Required side effects to populate the Create methods on the mesh class
import '@babylonjs/core/Meshes/meshBuilder'

class Screen {
    constructor(scene, videoElement, name) {
        this.scene = scene
        this.videoElement = videoElement
        this.name = name
        this.planeOpts = {
            height: 0.2625,
            width: 0.336,
            sideOrientation: Mesh.BACKSIDE,
        }
        this.screenVideo = MeshBuilder.CreatePlane(
            this.name,
            this.planeOpts,
            this.scene
        )
        this.screenVideoMat = new StandardMaterial('m', this.scene)
        this.screenVideoVidTex = new VideoTexture(
            'river',
            this.videoElement,
            this.scene,
            false,
            true
        )
    }

    init = () => {
        this.screenVideoMat.diffuseTexture = this.screenVideoVidTex
        this.screenVideoMat.roughness = 1
        this.screenVideoMat.emissiveColor = new Color3(0.9, 0.9, 0.9)
        this.screenVideo.material = this.screenVideoMat
        this.screenVideo.rotation = new Vector3(Math.PI, d2r(359.5), 0)
        this.screenVideo.position = new Vector3(
            config.screen.position.x,
            config.screen.position.y,
            config.screen.position.z
        )
        this.screenVideo.setEnabled(false)
    }
}

export default Screen
