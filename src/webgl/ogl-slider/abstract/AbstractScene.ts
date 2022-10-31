

import { isBetween } from "@/utils/misc/misc";
import { getViewport } from "@/utils/ogl/misc";
import { Camera, Transform, Vec3 } from "ogl-typescript";
import { MainContext } from "../WebGLController";

export default abstract class AbstractScene {
  public scene = new Transform()
  public camera: Camera

  protected context: MainContext
  protected name: string

  constructor(context: MainContext, name: string) {
    this.context = context
    this.name = name
  }

  protected generateContext = () => ({
    ...this.context,
    camera: this.camera,
    scene: this.scene,
  });

  protected getCamera(position = new Vec3(0, 0.0, 5.3)) {
    const camera = new Camera(this.context.renderer.gl, {
      fov: 20,
      near: 0.1,
      far: 1000
    })
    camera.position.copy(position)

    return camera
  }

  protected setCamera(position = new Vec3(0, 0, 5.3)) {
    this.camera = new Camera(this.context.renderer.gl, {
      fov: 21,
      near: 0.1,
      far: 1000
    })
    this.camera.position.copy(position)
  }

  public unmount() {
    console.log("unmount MainScene");
  }
}

export type AbstractSceneContext = ReturnType<AbstractScene["generateContext"]>;
