import { BloomEffect, EffectComposer, EffectPass, RenderPass, SelectiveBloomEffect, ShaderPass } from "postprocessing";
import { Camera, Mesh, Scene } from "three";
import ContextComponent from "../abstract/ContextComponent";
import BasicPostProcessingMaterial from "../materials/templates/BasicPostProcessingMaterial";
import { MainContext } from "../WebGLController";

type Props = {
  context: MainContext
}

export default class PostProcessing extends ContextComponent<MainContext> {
  public composer: EffectComposer
  public renderPass: RenderPass
  public vanillaPass: ShaderPass

  public bloomPass: EffectPass
  public bloomEffect: BloomEffect & { selection?: any, mipmapBlurPass?: any }

  public isBloomEnabled = false

  public background = true

  constructor({
    context,
  }: Props) {
    super(context)

    let samples: number
    switch (context.gpuTier.tier) {
      case 1:
        samples = 2
        break;

      case 2:
        samples = 4

      case 3:
        samples = 12

      default:
        break;
    }
    this.composer = new EffectComposer(context.renderer, {
      multisampling: samples,
    })
  }

  public addRenderPass(scene: Scene, camera: Camera) {
    this.renderPass = new RenderPass(scene, camera);
    this.composer.addPass(this.renderPass);
  }

  public removeRenderPass() {
    this.composer.removePass(this.renderPass);
    this.composer.removePass(this.vanillaPass);
  }

  public addVanillaPass() {
    this.vanillaPass = new ShaderPass(new BasicPostProcessingMaterial(), 'uFBO')
    this.composer.addPass(this.vanillaPass)
  }

  // Is called independently from addBloomPass()
  public setupBloomPass(scene: Scene, camera: Camera, meshes: Mesh[]) {
    this.bloomEffect = new SelectiveBloomEffect(scene, camera, {
      luminanceThreshold: 0.1,
      intensity: 20,
      resolutionScale: .5,
      mipmapBlur: true,
      levels: 16,
      radius: 0.95
    } as any)

    this.bloomEffect.selection.set(meshes)
    this.bloomPass = new EffectPass(camera, this.bloomEffect)
  }

  public addBloomPass() {
    this.composer.addPass(this.bloomPass);
    this.isBloomEnabled = true
    this.context.pane.refresh()
  }

  public removeBloomPass() {
    this.composer.removePass(this.bloomPass);
    this.isBloomEnabled = false
    this.context.pane.refresh()
  }

  public toggleBackground(toggle: boolean) {
    if (toggle) {
      document.querySelector<HTMLDivElement>('main').classList.add('image')
    } else {
      document.querySelector<HTMLDivElement>('main').classList.remove('image')
    }
  }

  public tweaks() {
    const folder = this.context.pane.addFolder({ title: "Post Processing", expanded: false })

    // Bloom
    folder.addInput(this.bloomEffect, 'intensity', { label: "Bloom Intensity", min: 0, max: 30 })

    // const bloomToggle = folder.addInput(this, "isBloomEnabled", { label: "Car Lights Bloom" })
    // bloomToggle.on("change", (e) => {
    //   if (e.value) {
    //     this.addBloomPass()
    //   } else if (!e.value) {
    //     this.removeBloomPass()
    //   }
    // })

    folder.addInput(this.bloomEffect.mipmapBlurPass, 'levels', { label: "Bloom Levels", min: 1, max: 64, step: 1 })
    folder.addInput(this.bloomEffect.mipmapBlurPass, 'radius', { label: "Bloom Radius", min: 0, max: 1 })

    // HTML Background
    const input = folder.addInput(this, 'background', { label: 'Toggle Background' })
    input.on('change', (e) => {
      this.toggleBackground(e.value)
    })
  }
}
