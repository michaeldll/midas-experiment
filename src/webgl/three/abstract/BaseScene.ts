import { PerspectiveCamera, Scene } from "three"
import { MainContext } from "../WebGLController"

export default abstract class BaseScene {
  public scene = new Scene()
  public camera: PerspectiveCamera
  protected context: MainContext

  constructor(context: MainContext, name: string) {
    this.context = context
    this.scene.name = name
  }
}
