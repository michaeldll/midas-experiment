import { GizmoManager } from '@babylonjs/core/Gizmos/gizmoManager'

class GizmoController {
    constructor(scene, mesh) {
        this.scene = scene
        this.mesh = mesh
        this.gizmoManager = new GizmoManager(this.scene)
    }

    init() {
        this.gizmoManager.positionGizmoEnabled = true
        this.gizmoManager.rotationGizmoEnabled = true
        this.gizmoManager.scaleGizmoEnabled = false
        this.gizmoManager.boundingBoxGizmoEnabled = false
        this.gizmoManager.usePointerToAttachGizmos = false
        this.gizmoManager.attachToMesh(this.mesh)
    }
}

export default GizmoController
