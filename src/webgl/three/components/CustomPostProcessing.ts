import {
  Mesh,
  OrthographicCamera,
  Scene,
  Vector2,
  WebGLRenderTarget,
  BufferGeometry,
  BufferAttribute,
  Camera,
  DepthTexture,
  DepthFormat,
  FloatType,
  ShaderMaterial,
} from "three"
import gsap, { Cubic } from "gsap"
import { MainContext } from "../WebGLController"
import { ExtendedRenderTargetOptions } from "../../../types/ExtendedRenderTargetOptions"
import ContextComponent from "../abstract/ContextComponent"
import MixDepthPostProcessing from "../materials/PostProcessing/MixDepthPostProcessing"
import BasicPostProcessingMaterial from "../materials/templates/BasicPostProcessingMaterial"

type MixDepthPass = {
  material: MixDepthPostProcessing
  fboA: WebGLRenderTarget
  fboB: WebGLRenderTarget
}

type VanillaPass = {
  material: BasicPostProcessingMaterial
  fbo: WebGLRenderTarget
}

// Heavily inspired by https://luruke.medium.com/simple-postprocessing-in-three-js-91936ecadfb7
export default class CustomPostProcessing extends ContextComponent<MainContext> {
  private vanillaPass: VanillaPass
  private dummyScene = new Scene()
  private dummyCamera: OrthographicCamera
  private fullScreenTriangle: Mesh

  constructor(context: MainContext, resolution: Vector2) {
    super(context)

    this.vanillaPass = {
      material: new BasicPostProcessingMaterial(),
      fbo: this.getRenderTarget(resolution)
    }

    this.dummyCamera = new OrthographicCamera()
    this.dummyCamera.position.z = 1

    this.fullScreenTriangle = this.getTriangle()
    this.dummyScene.add(this.fullScreenTriangle)
    this.dummyScene.add(this.dummyCamera)
  }

  private getRenderTarget = (resolution: Vector2) => {
    let samples: number
    switch (this.context.gpuTier.tier) {
      case 1:
        samples = 0
        break;

      case 2:
        samples = 4

      case 3:
        samples = 12

      default:
        break;
    }
    return new WebGLRenderTarget(resolution.x, resolution.y, { samples } as ExtendedRenderTargetOptions)
  }

  private getTriangle = () => {
    // Triangle expressed in clip space coordinates
    const geometry = new BufferGeometry();
    const vertices = new Float32Array([
      -1.0, -1.0,
      3.0, -1.0,
      -1.0, 3.0
    ]);
    geometry.setAttribute('position', new BufferAttribute(vertices, 2));

    const triangle = new Mesh(geometry, this.vanillaPass.material);
    // Our triangle will be always on screen, so avoid frustum culling checking
    triangle.frustumCulled = false;
    triangle.matrixAutoUpdate = false

    return triangle
  }

  public onResize = () => {
    const resolution = new Vector2()
    this.context.renderer.getDrawingBufferSize(resolution);

    /* MIX DEPTH PASS */
    // this.mixDepthPass.fboA.setSize(resolution.x, resolution.y)
    // this.mixDepthPass.fboB.setSize(resolution.x, resolution.y)
    // this.mixDepthPass.material.uniforms.uResolution.value.copy(resolution)

    /* VANILLA PASS */
    this.vanillaPass.fbo.setSize(resolution.x, resolution.y)
    this.vanillaPass.material.uniforms.uResolution.value.copy(resolution)
  }

  public renderPass(scene: Scene, camera: Camera) {
    this.fullScreenTriangle.material = this.vanillaPass.material
    this.vanillaPass.material.uniforms.uFbo.value = this.vanillaPass.fbo.texture
    this.context.renderer.setRenderTarget(this.vanillaPass.fbo);
    this.context.renderer.render(scene, camera);
  }

  public renderToScreen() {
    this.context.renderer.setRenderTarget(null)
    this.context.renderer.render(this.dummyScene, this.dummyCamera)
  }

  public tweaks = () => {
    const folder = this.context.pane.addFolder({ title: "Post Processing" })
  }

  public dispose = () => {
    const material = this.fullScreenTriangle.material as ShaderMaterial
    material.dispose()

    this.vanillaPass.fbo.dispose()

    /* MIX DEPTH PASS */
    // this.mixDepthPass.fboA.dispose()
    // this.mixDepthPass.fboB.dispose()
  }

  // public tweaks = () => {
  //   const folder = this.context.pane.addFolder({ title: "Post Processing" })

  //   /* MIX DEPTH PASS */
  //   folder.addInput(this.mixDepthPass.material.uniforms.uProgression, "value", {
  //     max: 1,
  //     min: 0,
  //     label: 'Mix Depth Progression'
  //   })
  //   folder.addInput(this.mixDepthPass.material.uniforms.uWidth, "value", {
  //     max: 1,
  //     min: 0,
  //     label: 'Mix Depth Width'
  //   })
  //   const button = folder.addButton({
  //     title: 'Transition Scenes',
  //   })
  //   button.on('click', () => {
  //     this.visibleFbo === "fboA" ? this.visibleFbo = "fboB" : this.visibleFbo = "fboA"
  //     this.transitionScenes(this.visibleFbo === "fboA")
  //   });
  // }

  // private initMixDepthPass = () => {
  //   /* MIX DEPTH PASS */
  //   this.mixDepthPass = {
  //     material: new MixDepthPostProcessing(resolution),
  //     fboA: this.getRenderTarget(resolution),
  //     fboB: this.getRenderTarget(resolution),
  //   }

  //   const depthTexture = new DepthTexture(resolution.x, resolution.y)
  //   depthTexture.format = DepthFormat;
  //   depthTexture.type = FloatType
  //   this.mixDepthPass.fboA.depthTexture = depthTexture
  //   this.mixDepthPass.material.uniforms.uDepth.value = this.mixDepthPass.fboA.depthTexture;
  // }

  /* MIX DEPTH PASS */
  // Render fboA or fboB
  // public renderMixDepthPass(scene: Scene, camera: Camera, fbo: "fboA" | "fboB") {
  //   this.fullScreenTriangle.material = this.mixDepthPass.material
  //   this.mixDepthPass.material.uniforms[fbo].value = this.mixDepthPass[fbo].texture
  //   this.context.renderer.setRenderTarget(this.mixDepthPass[fbo]);
  //   this.context.renderer.render(scene, camera);
  // }

  /* MIX DEPTH PASS */
  // Transition FBOs
  // public transitionScenes(toggle: boolean) {
  //   if (toggle) {
  //     this.transitionOut()
  //   } else {
  //     this.transitionIn()
  //   }
  // }

  /* MIX DEPTH PASS */
  // private transitionIn() {
  //   gsap.to(this.mixDepthPass.material.uniforms.uProgression, {
  //     value: .99,
  //     duration: 3,
  //     ease: Cubic.easeInOut
  //   })
  //   gsap.to(this.mixDepthPass.material.uniforms.uWidth, {
  //     value: 0.07,
  //     duration: 3,
  //     onUpdate: () => { this.context.pane.refresh() },
  //     ease: Cubic.easeInOut
  //   })
  // }

  /* MIX DEPTH PASS */
  // private transitionOut() {
  //   gsap.to(this.mixDepthPass.material.uniforms.uProgression, {
  //     value: 0.1,
  //     duration: 3,
  //     ease: Cubic.easeInOut
  //   })
  //   gsap.to(this.mixDepthPass.material.uniforms.uWidth, {
  //     value: 0.02,
  //     duration: 3,
  //     onUpdate: () => { this.context.pane.refresh() },
  //     ease: Cubic.easeInOut
  //   })
  // }
}

// public visibleFbo: "fboA" | "fboB" = "fboA" // Can be used to reduce number of renders