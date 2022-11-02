import { FolderApi } from "tweakpane";
import AbstractScene from "../abstract/AbstractScene";
import RadialSlider from "../components/RadialSlider";
import { MainContext } from "../WebGLController";
import { SliderImagesData } from "@/types/Images";
import { isBetween } from "@/utils/misc/misc";
import { getViewport } from "@/utils/ogl/misc";
import { Vec3 } from "ogl-typescript";

export default class SliderScene extends AbstractScene {
  public slider: RadialSlider
  public indexDebug = 0

  private config = {
    radius: 1.75,
    lightPosition: new Vec3(1.),
    lightIntensity: { value: 0.3 },
    baseColorIntensity: { value: 0 }
  }

  constructor(context: MainContext, imagesData: SliderImagesData[]) {
    super(context, "Slider Scene")

    this.config.radius = imagesData.length / 2.28
    this.setCamera()
    this.onResize();
    this.setObjects(imagesData);
    this.setEvents();

    this.tweaks()
  }

  private setObjects(imagesData: SliderImagesData[]) {
    this.slider = new RadialSlider({ context: this.generateContext(), config: this.config, imagesData })
    this.slider.group.setParent(this.scene)
  }

  private onSlideChange = (e: CustomEvent) => {
    this.context.state.activeIndex = e.detail.index
  }

  private onKeydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight":
        {
          const index = (this.context.state.activeIndex + 1) % this.context.imagesData.length

          document.body.dispatchEvent(
            new CustomEvent('slidechange', {
              detail: { index },
            })
          )
        }
        break;

      case "ArrowLeft":
        {
          const index = (this.context.state.activeIndex - 1) % this.context.imagesData.length

          document.body.dispatchEvent(
            new CustomEvent('slidechange', {
              detail: { index },
            })
          )
        }
        break

      default:
        break;
    }
  }

  private onResize = () => {
    const canvas = this.context.renderer.gl.canvas
    const rect = canvas.getBoundingClientRect()
    this.context.renderer.setSize(rect.width, rect.height);
    this.camera.perspective({
      aspect: rect.width / rect.height,
    });

    this.context.renderer.dpr = Math.min(2, window.devicePixelRatio);

    // Resize
    const breakTabletP = 768;
    const breakTabletL = 1024;
    this.camera.position.z = 5
    if (isBetween(breakTabletL, breakTabletP)) this.camera.position.z = 5
    else if (isBetween(breakTabletP - 1)) this.camera.position.z = 5

    this.context.viewport = getViewport(this.camera)
  };

  private setEvents = () => {
    window.addEventListener("resize", this.onResize);

    window.addEventListener('keydown', this.onKeydown)

    document.body.addEventListener(
      'slidechange',
      this.onSlideChange,
      false
    )

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        let index = 19
        setInterval(() => {
          if (index == 0) index = 19
          else index -= 1

          document.querySelector('#number').innerHTML = index.toString()
        }, 1000)
        setInterval(() => {
          document.body.dispatchEvent(
            new CustomEvent('slidechange', {
              detail: { index: (this.context.state.activeIndex + 1) % this.context.imagesData.length },
            })
          )
        }, 20000)
      }
    })
  };

  public removeEvents = () => {
    window.removeEventListener("resize", this.onResize);

    document.body.removeEventListener(
      'slidechange',
      this.onSlideChange
    )
  }

  private tweaks = () => {
    const folder: FolderApi = this.context.pane.addFolder({
      title: this.name,
    });

    folder.addInput(this.camera, "position", { label: "Camera Position" });
    folder.addInput(this.camera, "rotation", { label: "Camera Rotation" });
    // const indexDebug = folder.addInput(this, "indexDebug", { min: 0, max: this.context.imagesData.length, step: 1 })
    // indexDebug.on("change", (e) => {
    //   this.context.state.activeIndex = e.value
    // })
    folder.addInput(this.config, 'lightPosition')
    folder.addInput(this.config.lightIntensity, 'value')
    folder.addInput(this.config.baseColorIntensity, 'value')
  }

  public tick(deltaTime: number, elapsedTime: number) {
    this.slider.tick(deltaTime, elapsedTime)
  }
}

export type SliderSceneContext = ReturnType<SliderScene["generateContext"]>;
export type Config = { radius: number, lightPosition: Vec3, lightIntensity: { value: number }, baseColorIntensity: { value: number } }