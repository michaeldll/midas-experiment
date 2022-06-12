import { AbstractSceneContext } from "../abstract/AbstractScene"
import ContextComponent from "../abstract/ContextComponent"

type Props = {
  context: AbstractSceneContext
}

export default class Template extends ContextComponent {
  constructor({
    context,
  }: Props) {
    super(context)
  }
}
