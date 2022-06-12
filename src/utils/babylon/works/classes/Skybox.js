import { MeshBuilder } from '@babylonjs/core/Meshes'
import { StandardMaterial } from '@babylonjs/core/Materials'
import { CubeTexture, Texture } from '@babylonjs/core/Materials/Textures'
import { Color3 } from '@babylonjs/core/Maths/math'
// Required side effects to populate the Create methods on the mesh class
import '@babylonjs/core/Meshes/meshBuilder'

class Skybox {
    constructor(scene, environmentIntensity) {
        this.scene = scene
        this.environmentIntensity = environmentIntensity
        this.skybox = MeshBuilder.CreateBox(
            'skyBox',
            { size: 1000.0 },
            this.scene
        )
        this.skyboxMaterial = new StandardMaterial('skyBox', this.scene)
    }

    init() {
        this.skyboxMaterial.backFaceCulling = false
        this.skyboxMaterial.reflectionTexture = new CubeTexture(
            'skybox/2/skybox',
            this.scene
        )
        this.skyboxMaterial.reflectionTexture.coordinatesMode =
            Texture.SKYBOX_MODE
        this.skyboxMaterial.diffuseColor = new Color3(0, 0, 0)
        this.skyboxMaterial.specularColor = new Color3(0, 0, 0)
        this.skybox.material = this.skyboxMaterial
        this.scene.environmentTexture = new CubeTexture(
            'skybox/2/skybox',
            this.scene
        )
        this.scene.environmentTexture = new CubeTexture(
            'skybox/skybox',
            this.scene
        )
        this.scene._environmentIntensity = this.environmentIntensity
    }
}

export default Skybox
