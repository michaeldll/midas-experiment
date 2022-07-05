import { BloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";
import SceneOne from "../scenes/SceneOne";
import { MainContext } from "../WebGLController";

type Props = {
  context: MainContext
  sceneOne: SceneOne
}

export default class PostProcessing {
  public composer: EffectComposer
  public renderPass: RenderPass
  public bloomPass: EffectPass

  constructor({
    context,
    sceneOne
  }: Props) {
    let samples: number
    switch (context.gpuTier.tier) {
      case 1:
        samples = 2
        break;

      case 2:
        samples = 6

      case 3:
        samples = 12

      default:
        break;
    }
    this.composer = new EffectComposer(context.renderer, {
      multisampling: samples
    })
    this.renderPass = new RenderPass(sceneOne.scene, sceneOne.camera);
    this.bloomPass = new EffectPass(sceneOne.camera, new BloomEffect({ intensity: 0, luminanceThreshold: 1 }))
    this.composer.addPass(this.renderPass);
    this.composer.addPass(this.bloomPass);
  }
}
