import { Clock, Raycaster, TextureLoader, WebGLRenderer } from "three";
import { Pane } from "tweakpane";
import { GLTFLoader } from "@/utils/libs/GLTFLoader"
import { getProxyState, isTouchDevice } from "../../utils/misc/misc";
import { Phase } from "../../types/Phase";
import FramerateManager from "./components/FramerateManager";
import SceneOne from "./scenes/SceneOne";
import PostProcessing from "./components/PostProcessing";
import { TierResult } from 'detect-gpu';
import VirtualScroll from 'virtual-scroll'

export default class WebGLController {
  public sceneOne: SceneOne;

  private clock = new Clock();
  private canvas: HTMLCanvasElement;
  private renderer: WebGLRenderer;
  private initialState: { phase: Phase } = { phase: "DEBUG" }
  private state = getProxyState(this.initialState);
  private postprocessing: PostProcessing
  private pane = new Pane()
  private framerateManager: FramerateManager;
  private gpuTier: TierResult

  constructor(canvas: HTMLCanvasElement, gpuTier: TierResult) {
    this.canvas = canvas;
    this.gpuTier = gpuTier

    this.setRenderer();
    this.sceneOne = new SceneOne(this.generateContext());
    this.setEvents();
    this.framerateManager = new FramerateManager({ targetFPS: 57 });
    this.postprocessing = new PostProcessing({ context: this.generateContext(), sceneOne: this.sceneOne })
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
    postprocessing: this.postprocessing,
    scroller: new VirtualScroll({
      useKeyboard: false,
    }),
    gpuTier: this.gpuTier
  });

  private setEvents = () => {

  };

  private tweaks = () => {
    this.framerateManager && this.framerateManager.tweaks(this.pane);
    const stateList: any = this.pane.addBlade({
      view: 'list',
      label: 'State Phase',
      options: [
        { text: 'DEBUG', value: 'DEBUG' },
        { text: 'INTRO', value: 'INTRO' },
        { text: 'MIDDLE', value: 'MIDDLE' },
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
    this.postprocessing.composer.render()

    this.framerateManager && this.framerateManager.tick(deltaTime);
    this.pane.refresh()
  };

  public unmount = () => {

  };
}

export type MainContext = ReturnType<WebGLController["generateContext"]>;
