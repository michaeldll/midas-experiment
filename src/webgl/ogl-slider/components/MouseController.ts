
import { Vec2 } from "ogl-typescript";
import { AbstractSceneContext } from "../abstract/AbstractScene";
import ContextComponent from "../abstract/ContextComponent";

export class MouseController extends ContextComponent<AbstractSceneContext> {
  public normalizedMousePosition = new Vec2();
  public event: MouseEvent;

  constructor(context: AbstractSceneContext) {
    super(context)
    this.setEvents()
  }

  private onPointerMove = (e: any) => {
    this.event = e;

    const { clientX, clientY } =
      e.touches && e.touches.length ? e.touches[0] : e;
    this.normalizedMousePosition.x = (clientX / window.innerWidth) * 2 - 1;
    this.normalizedMousePosition.y = -(clientY / window.innerHeight) * 2 + 1;
  };

  private setEvents = () => {
    window.addEventListener("mousemove", this.onPointerMove);
    window.addEventListener("touchmove", this.onPointerMove);
  };
}
