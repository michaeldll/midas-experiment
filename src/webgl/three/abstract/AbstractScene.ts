import { MainContext } from "../WebGLController";
import { FolderApi } from "tweakpane";
import {
  AxesHelper,
  GridHelper,
  Material,
  Mesh,
  PerspectiveCamera,
  Scene,
  Vector3,
} from "three";
import { OrbitControls } from "@/utils/libs/OrbitControls";

export default abstract class AbstractScene {
  public name: string
  public scene = new Scene()
  public camera: PerspectiveCamera

  protected orbit: OrbitControls;
  protected context: MainContext

  constructor(context: MainContext, name: string) {
    this.context = context
    this.scene.name = name
  }

  protected generateContext = () => ({
    ...this.context,
    camera: this.camera,
    scene: this.scene,
    controls: this.orbit,
  });

  protected getCamera() {
    const camera = new PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0.0, 10);

    return camera
  }

  protected setCamera() {
    this.camera = new PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0.0, 10);

    this.onResize();

    this.camera.lookAt(new Vector3(0, 0, 0));
  }

  protected setOrbit(enabled: boolean) {
    this.orbit = new OrbitControls(
      this.camera,
      this.context.renderer.domElement
    );
    this.orbit.update();
    this.orbit.enabled = enabled;
  }

  protected onResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.context.renderer.setSize(width, height);
    this.context.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  };

  protected debug() {
    this.scene.add(new AxesHelper(5));
    this.scene.add(new GridHelper());
  }

  protected tweaks = () => {
    const folder: FolderApi = this.context.pane.addFolder({
      title: this.scene.name,
    });

    folder.addInput(this.orbit, "enabled", { label: "Toggle orbit" });
    folder.addInput(this.camera, "position", { label: "Camera Position" });
  }

  public unmount() {
    this.scene.traverse((obj) => {
      if (obj.type === "Mesh") {
        const mesh = obj as Mesh
        mesh.geometry.dispose()
        const material = mesh.material as Material
        material.dispose()
      }
    })
  }
}

export type AbstractSceneContext = ReturnType<AbstractScene["generateContext"]>;
