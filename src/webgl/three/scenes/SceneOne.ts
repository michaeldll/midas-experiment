import { Phase } from "@/types/Phase";
import { BoxGeometry, Mesh, MeshBasicMaterial } from "three";
import AbstractScene from "../abstract/AbstractScene";
import { MainContext } from "../WebGLController";

type SceneObjects = {
}

export default class SceneOne extends AbstractScene {
  private sceneObjects: SceneObjects

  constructor(context: MainContext) {
    super(context, 'scene-one')

    this.setCamera()
    this.setOrbit(true)
    this.setObjects();
    this.setEvents();
    this.tweaks()
    this.debug();
  }

  private setObjects() {
    const cube = new Mesh(new BoxGeometry(), new MeshBasicMaterial({ color: "red" }))
    this.scene.add(cube)
  }

  private onPhaseChange = (value: Phase, previousValue: Phase) => {

  }

  protected setEvents = () => {
    window.addEventListener("resize", this.onResize);
    this.context.state.onChange("phase", this.onPhaseChange)
  };

  public removeEvents = () => {
    window.removeEventListener("resize", this.onResize)
  }

  public tick(deltaTime: number, elapsedTime: number) {
    switch (this.context.state.phase) {
      default:
        break;
    }
  }
}