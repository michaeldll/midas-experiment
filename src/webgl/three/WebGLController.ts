import { Clock, Raycaster, TextureLoader, WebGLRenderer } from "three";
import { Pane } from "tweakpane";
import VRMSceneSolid from "./scenes/SceneOne";
import { GLTFLoader } from "@/utils/libs/GLTFLoader"
import { getProxyState, isTouchDevice } from "../../utils/misc/misc";
import { Phase } from "../../types/Phase";
import CustomPostProcessing from "./components/CustomPostProcessing";
import FramerateManager from "./components/FramerateManager";
import SceneTwo from "./scenes/SceneTwo";
import SceneOne from "./scenes/SceneOne";

export default class WebGLController {
  public sceneOne: SceneOne;
  public sceneTwo: SceneTwo;

  private clock = new Clock();
  private canvas: HTMLCanvasElement;
  private renderer: WebGLRenderer;
  private initialState: { phase: Phase } = { phase: "DEBUG" }
  private state = getProxyState(this.initialState);
  private postprocessing: CustomPostProcessing
  private pane = new Pane()
  private framerateManager: FramerateManager;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.setRenderer();
    this.postprocessing = new CustomPostProcessing(
      this.generateContext(),
      [window.innerWidth * this.renderer.getPixelRatio(), window.innerHeight * this.renderer.getPixelRatio()]
    )
    this.sceneOne = new SceneOne(this.generateContext());
    this.sceneTwo = new SceneTwo(this.generateContext());
    this.setEvents();
    this.framerateManager = new FramerateManager({ targetFPS: 57 });
    this.tweaks()
  }

  public setRenderer = () => {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      antialias: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  public generateContext = () => ({
    renderer: this.renderer,
    clock: this.clock,
    textureLoader: new TextureLoader(),
    raycaster: new Raycaster(),
    pane: this.pane,
    isTouchDevice: isTouchDevice(),
    gltfLoader: new GLTFLoader(),
    state: this.state,
    postprocessing: this.postprocessing
  });

  private setEvents = () => {
    window.addEventListener("resize", this.postprocessing.onResize)
  };

  private tweaks = () => {
    this.postprocessing.tweaks()
    this.framerateManager && this.framerateManager.tweaks(this.pane);
    const stateList: any = this.pane.addBlade({
      view: 'list',
      label: 'State Phase',
      options: [
        { text: 'DEBUG', value: 'DEBUG' },
        { text: 'INTRO', value: 'INTRO' },
        { text: 'INTRO_TRANSITION', value: 'INTRO_TRANSITION' },
        { text: 'MIDDLE_TRANSITION', value: 'MIDDLE_TRANSITION' },
        { text: 'MIDDLE', value: 'MIDDLE' },
        { text: 'OUTRO', value: 'OUTRO' },
      ],
      value: 'DEBUG',
    });
    stateList.on("change", (e) => {
      this.state.phase = e.value
    })
  }

  public tick = () => {
    const deltaTime = this.clock.getDelta()
    const elapsedTime = this.clock.elapsedTime

    this.sceneOne.tick(deltaTime, elapsedTime);
    this.sceneTwo.tick(deltaTime, elapsedTime);
    this.postprocessing.renderPass(this.sceneOne.scene, this.sceneOne.camera, "fboA")
    this.postprocessing.renderPass(this.sceneTwo.scene, this.sceneTwo.camera, "fboB")
    this.postprocessing.renderToScreen()

    this.framerateManager && this.framerateManager.tick(deltaTime);
    this.pane.refresh()
  };

  public unmount = () => {
    // this.vrmScene.unmount();
  };
}

export type MainContext = ReturnType<WebGLController["generateContext"]>;
