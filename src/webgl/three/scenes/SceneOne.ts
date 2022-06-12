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

    this.scene.fog = this.fog;
    this.setCameraAndOrbit();
    this.setObjects();
    this.setEvents();
    this.tweaks()
    // this.debug();
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
}