/* eslint-disable array-callback-return */
//Cannon for physics
import * as CANNON from 'cannon'
import { CannonJSPlugin } from '@babylonjs/core/Physics/Plugins/cannonJSPlugin'

//Greensock for animation
import gsap from 'gsap'

import { Vector3 } from '@babylonjs/core/Maths/math'
import { PhysicsImpostor } from '@babylonjs/core/Physics/physicsImpostor'
import { Mesh } from '@babylonjs/core/Meshes'
import { StandardMaterial } from '@babylonjs/core/Materials'

import config from '../utils/config'
import findMesh from '../utils/findMesh'
import d2r from '../utils/d2r.js.js'

class PhysicsController {
    constructor(scene, audio) {
        this.scene = scene
        this.audio = audio
        this.gravityVector = new Vector3(0, -4.81, 0)
        this.physicsPlugin = new CannonJSPlugin(false, 10, CANNON)
        this.transMat = new StandardMaterial('transparent', this.scene)
        this.meshesWithCollisionSounds = []
    }

    init() {
        this.scene.enablePhysics(this.gravityVector, this.physicsPlugin)
        this.scene.getPhysicsEngine().setTimeStep(1 / 60)

        //this part is very ugly, sorry
        //all transparent PhysicsImpostors are here for the phone to bounce off of

        //CRT
        const crt = Mesh.CreateBox('transparentCRT', 1, this.scene)
        crt.isPickable = false
        crt.position = new Vector3(-0.557, 0.433, -0.293)
        crt.scaling = new Vector3(0.5, 0.489, 0.451)
        crt.physicsImpostor = new PhysicsImpostor(
            crt,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0 },
            this.scene
        )
        this.meshesWithCollisionSounds.push(crt)

        //PS1 Controller
        const controller = findMesh('playstation-analog-controller', this.scene)
        controller.setParent(null)
        controller.physicsImpostor = new PhysicsImpostor(
            controller,
            PhysicsImpostor.BoxImpostor,
            { mass: 5, restitution: 0.1 },
            this.scene
        )

        //Drawer
        const drawer = findMesh('drawer_primitive1', this.scene)
        drawer.setParent(null)
        drawer.physicsImpostor = new PhysicsImpostor(
            drawer,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, friction: 1, restitution: 0 },
            this.scene
        )
        this.meshesWithCollisionSounds.push(drawer)
        drawer.isPickable = false

        //Speakers
        const rightSpeaker = findMesh('speaker right', this.scene)
        rightSpeaker.setParent(null)
        rightSpeaker.physicsImpostor = new PhysicsImpostor(
            rightSpeaker,
            PhysicsImpostor.BoxImpostor,
            { mass: 10, restitution: 0.2 },
            this.scene
        )
        this.meshesWithCollisionSounds.push(rightSpeaker)

        const leftSpeaker = findMesh('speaker left', this.scene)
        leftSpeaker.setParent(null)
        leftSpeaker.physicsImpostor = new PhysicsImpostor(
            leftSpeaker,
            PhysicsImpostor.BoxImpostor,
            { mass: 10, restitution: 0.2 },
            this.scene
        )
        this.meshesWithCollisionSounds.push(leftSpeaker)

        //Desk top
        const deskTop = findMesh('Desk Top', this.scene)
        deskTop.setParent(null)
        deskTop.physicsImpostor = new PhysicsImpostor(
            deskTop,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, friction: 1, restitution: 0 },
            this.scene
        )
        this.meshesWithCollisionSounds.push(deskTop)

        //Ground
        const ground = Mesh.CreateGround(
            'transparentGround',
            100,
            100,
            100,
            this.scene
        )
        ground.position.y = config.physicsGround.position.y //-0.392
        ground.physicsImpostor = new PhysicsImpostor(
            ground,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0 },
            this.scene
        )
        this.meshesWithCollisionSounds.push(ground)
        ground.isPickable = false

        //Keyboard
        const keyboard = findMesh('Keyboard.001', this.scene)
        keyboard.setParent(null)
        keyboard.physicsImpostor = new PhysicsImpostor(
            keyboard,
            PhysicsImpostor.BoxImpostor,
            { mass: 10, restitution: 0.2 },
            this.scene
        )

        //Mouse
        const mouse = findMesh('MOUSE', this.scene)
        mouse.position.y += 0.01
        mouse.setParent(null)
        mouse.physicsImpostor = new PhysicsImpostor(
            mouse,
            PhysicsImpostor.BoxImpostor,
            { mass: 10, restitution: 0.2 },
            this.scene
        )

        //Right wall
        const rightWall = Mesh.CreateBox('rightWall', 1, this.scene)

        rightWall.position = new Vector3(0.316, 0, -0)
        rightWall.rotation.x = d2r(1)
        rightWall.rotation.y = d2r(172)
        rightWall.rotation.z = d2r(1)
        rightWall.scaling = new Vector3(0.166, 0.637, 1.169)

        rightWall.physicsImpostor = new PhysicsImpostor(
            rightWall,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0 },
            this.scene
        )

        rightWall.isPickable = false

        //Left wall
        const leftWall = Mesh.CreateBox('leftWall', 1, this.scene)

        leftWall.position = new Vector3(-1.415, -0.011, 0)
        leftWall.rotation.x = d2r(1)
        leftWall.rotation.y = d2r(187)
        leftWall.rotation.z = d2r(1)
        leftWall.scaling = new Vector3(0.17, 0.655, 1.324)

        leftWall.physicsImpostor = new PhysicsImpostor(
            leftWall,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0 },
            this.scene
        )

        leftWall.isPickable = false

        //Front wall
        const frontWall = Mesh.CreateBox('frontWall', 1, this.scene)

        frontWall.position = new Vector3(-0.508, 0, 0)
        frontWall.rotation.x = d2r(1)
        frontWall.rotation.y = d2r(90)
        frontWall.rotation.z = d2r(1)
        frontWall.scaling = new Vector3(0.366, 0.637, 1.469)

        frontWall.physicsImpostor = new PhysicsImpostor(
            rightWall,
            PhysicsImpostor.BoxImpostor,
            { mass: 0, restitution: 0 },
            this.scene
        )

        frontWall.isPickable = false

        //Phone
        const phone = findMesh('phone', this.scene)
        phone.physicsImpostor = new PhysicsImpostor(
            phone,
            PhysicsImpostor.BoxImpostor,
            { mass: 1, friction: 0.3, restitution: 0.1 },
            this.scene
        )

        //Postit Stack
        const postitStack = findMesh('tuto.stack top', this.scene)
        postitStack.setParent(null)
        postitStack.physicsImpostor = new PhysicsImpostor(
            postitStack,
            PhysicsImpostor.BoxImpostor,
            { mass: 10, restitution: 0.2 },
            this.scene
        )

        //Phone reset bounding box
        const phoneBoundingBox = Mesh.CreateBox(
            'phoneBoundingBox',
            1,
            this.scene
        )
        phoneBoundingBox.position = new Vector3(-0.55, 0.237, -0.55)
        phoneBoundingBox.scaling = new Vector3(0.9, 0.232, 0.264)

        phoneBoundingBox.isPickable = false

        //Phone collision
        const collisionsSounds = [
            this.audio.sfx.phoneCollision1,
            this.audio.sfx.phoneCollision2,
            this.audio.sfx.phoneCollision3,
        ]

        //Collisions
        let previousCollidedAgainst

        const onPhoneCollide = (collider, collidedAgainst) => {
            if (
                !collisionsSounds.find((collisionSound) =>
                    collisionSound.playing()
                )
            ) {
                // console.log(previousCollidedAgainst)

                if (
                    !previousCollidedAgainst ||
                    previousCollidedAgainst !== collidedAgainst
                ) {
                    //play random sound
                    const randSound =
                        collisionsSounds[
                        Math.floor(Math.random() * collisionsSounds.length)
                        ]
                    randSound.rate(1.5 - Math.floor(Math.random() * 10) * 0.1)
                    randSound.play()
                    previousCollidedAgainst = collidedAgainst
                }
            }
        }
        phone.physicsImpostor.registerOnPhysicsCollide(
            this.meshesWithCollisionSounds.map((mesh) => mesh.physicsImpostor),
            onPhoneCollide
        )

        //Transparent material
        this.transMat.alpha = 0
        ground.material = this.transMat
        crt.material = this.transMat
        frontWall.material = this.transMat
        rightWall.material = this.transMat
        leftWall.material = this.transMat
        phoneBoundingBox.material = this.transMat
    }

    /**
     * @param {Mesh} mesh
     * @param {Vector3} direction
     * @param {Number} power
     */
    push(mesh, direction, power) {
        mesh.physicsImpostor.setLinearVelocity(
            mesh.physicsImpostor.getLinearVelocity().add(direction.scale(power))
        )
    }

    throwPhone() {
        const phone = findMesh('phone', this.scene)
        const phoneInHand = findMesh('phone.child', this.scene)
        const arm = this.scene.rootNodes[0]._children.find((child) => {
            if (child.name === 'main_enfant.004') return child
        })
        const initial = -1.23

        gsap.to(arm.position, { z: initial + 0.008, duration: 0.1 })
        gsap.to(arm.position, {
            z: initial - 0.008,
            duration: 0.1,
            delay: 0.1,
        })

        phone.setEnabled(true)
        phoneInHand.setEnabled(false)

        phone.physicsImpostor.setLinearVelocity(Vector3.Zero())
        phone.physicsImpostor.setAngularVelocity(Vector3.Zero())
        phone.rotationQuaternion.copyFromFloats(0, 0, 0, 1)

        phone.position = new Vector3(
            this.scene.activeCamera.position.x + 0.05,
            this.scene.activeCamera.position.y - 0.05,
            this.scene.activeCamera.position.z + 0.05
        )

        this.push(phone, this.scene.activeCamera.getForwardRay().direction, 6)
    }

    resetPhone() {
        const phone = findMesh('phone', this.scene)

        phone.position = new Vector3(
            config.phone.position.x,
            config.phone.position.y + 0.2,
            config.phone.position.z + 0
        )

        phone.rotationQuaternion.copyFromFloats(
            config.phone.rotation.x,
            config.phone.rotation.y,
            config.phone.rotation.z,
            1
        )

        phone.physicsImpostor.setLinearVelocity(Vector3.Zero())
        phone.physicsImpostor.setAngularVelocity(Vector3.Zero())
    }

    /**
     * @param {Mesh} mesh
     * @param {Vector3} vector
     */
    touch(mesh, vector = new Vector3(1.5, 0, 0.8)) {
        mesh.physicsImpostor.applyImpulse(vector, mesh.getAbsolutePosition())
    }
}

export default PhysicsController
