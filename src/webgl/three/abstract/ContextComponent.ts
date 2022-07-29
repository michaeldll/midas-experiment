import { MainContext } from "../WebGLController"

export default abstract class ContextComponent<T extends MainContext> {
  protected context: T

  constructor(context: T) {
    this.context = context
  }
}
