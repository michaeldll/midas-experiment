
import { Pane } from "tweakpane";
import { TierResult } from 'detect-gpu';
import SliderScene from "./scenes/SliderScene";
import FramerateManager from "./components/FramerateManager";
import { Renderer, Texture } from "ogl-typescript";
import { getProxyState, isTouchDevice } from "@/utils/misc/misc";
import { Clock } from "@/utils/threejs/Clock";
import { State } from "@/types/State";
import { SliderImagesData, SliderImagesToLoad } from "@/types/Images";

export default class WebGLController {
  public sliderScene: SliderScene

  private clock = new Clock();
  private canvas: HTMLCanvasElement;
  private renderer: Renderer;
  private initialState: State = { activeIndex: 0 }
  private state = getProxyState(this.initialState);
  private pane = new Pane()
  private framerateManager: FramerateManager;
  private gpuTier: TierResult
  private imagesData: SliderImagesData[]

  constructor(canvas: HTMLCanvasElement, gpuTier: TierResult, images: SliderImagesToLoad) {
    this.canvas = canvas;
    this.gpuTier = gpuTier

    this.setRenderer(this.gpuTier.tier > 1);

    this.framerateManager = new FramerateManager({ targetFPS: 57 });

    if (!location.hash.includes("debug")) this.pane.hidden = true

    let promises: Promise<SliderImagesData>[] = [];

    for (let index = 0; index < images.length; index++) {
      const { url, alt } = images[index];

      promises.push(new Promise<SliderImagesData>((resolve, reject) => {
        const texture = new Texture(this.renderer.gl);
        const img = new Image();
        img.crossOrigin = "Anonymous"
        img.onload = () => {
          texture.image = img
          resolve({ id: index, name: alt, texture })
        };
        img.src = url;
      }))
    }

    Promise.all(promises).then((imagesData) => {
      this.imagesData = imagesData

      this.sliderScene = new SliderScene(this.generateContext(), imagesData)

      this.tweaks()

      this.sliderScene.slider.manageActiveSlide(this.state.activeIndex)
    })
  }

  public setRenderer = (antialias = false) => {
    this.renderer = new Renderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
      antialias,
      dpr: Math.min(window.devicePixelRatio, 2),
      stencil: false
    });

    // (this.renderer.gl as any).clearColor(...new Color("#140e1b"), 1);
  };

  public generateContext = () => ({
    renderer: this.renderer,
    clock: this.clock,
    pane: this.pane,
    isTouchDevice: isTouchDevice(),
    state: this.state,
    gpuTier: this.gpuTier,
    imagesData: this.imagesData,
    initialIndex: 0,
    viewport: { width: 0, height: 0 }
  });

  private tweaks = () => {
    this.framerateManager.tweaks(this.pane)
  }

  public tick = () => {
    const deltaTime = this.clock.getDelta()
    const elapsedTime = this.clock.elapsedTime

    if (this.sliderScene) {
      this.sliderScene.tick(deltaTime, elapsedTime);

      this.renderer.render({
        scene: this.sliderScene.scene,
        camera: this.sliderScene.camera
      })
    }

    this.framerateManager && this.framerateManager.tick(deltaTime);

    if (!this.pane.hidden) this.pane.refresh()
  };

  public unmount = () => {
    this.sliderScene.scene.traverse((transform) => {
      const casted = transform as any
      if (casted.geometry) {
        casted.geometry.remove()
      }
      if (casted.program) {
        casted.program.remove()
      }
    })

    this.sliderScene.removeEvents()

    this.pane.dispose()
  };
}

export type MainContext = ReturnType<WebGLController["generateContext"]>;
