import {
  Intersection,
  Mesh,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  ShaderMaterial,
  Vector2,
} from "three";
import { AbstractSceneContext } from "../abstract/AbstractScene";
import ContextComponent from "../abstract/ContextComponent";

export class MouseController extends ContextComponent<AbstractSceneContext> {
  public intersects: Intersection[];
  public normalizedMousePosition = new Vector2();
  public event: MouseEvent;

  constructor(context: AbstractSceneContext) {
    super(context)
    this.intersects = [];
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

  public removeEvents = () => {
    window.removeEventListener("mousemove", this.onPointerMove)
    window.removeEventListener("touchmove", this.onPointerMove)
  }

  private onIntersect = () => {

  }

  private onNoIntersect = () => {

  }

  public tick(
    camera: PerspectiveCamera | OrthographicCamera,
    raycastedObjects?: Object3D[]
  ) {
    if (raycastedObjects && !!raycastedObjects.length && typeof raycastedObjects[0] !== "undefined") {
      this.context.raycaster.setFromCamera(this.normalizedMousePosition, camera);
      this.intersects = this.context.raycaster.intersectObjects(
        raycastedObjects,
        true
      );
      if (this.intersects.length) this.onIntersect()
      else this.onNoIntersect()
    }
  }
}
