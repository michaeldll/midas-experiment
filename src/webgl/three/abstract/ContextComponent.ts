import { AbstractSceneContext } from "./AbstractScene"

export default abstract class ContextComponent {
  protected context: AbstractSceneContext

  constructor(context: AbstractSceneContext) {
    this.context = context
  }
}
