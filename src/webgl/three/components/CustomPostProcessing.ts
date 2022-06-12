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
} from "three"
import gsap, { Cubic } from "gsap"
import MixDepthPostProcessing from "../materials/PostProcessing/MixDepthPostProcessing"
import { MainContext } from "../WebGLController"
import { ExtendedRenderTargetOptions } from "../../../types/ExtendedRenderTargetOptions"

type MixDepthPass = {
  material: MixDepthPostProcessing
  fboA: WebGLRenderTarget
  fboB: WebGLRenderTarget
}

export default class CustomPostProcessing {
  private mixDepthPass: MixDepthPass
  private context: MainContext
  private dummyScene = new Scene()
  private dummyCamera: OrthographicCamera
  private fullScreenTriangle: Mesh

  constructor(context: MainContext, resolution: number[]) {
    this.context = context

    this.mixDepthPass = {
      material: new MixDepthPostProcessing(resolution),
      fboA: new WebGLRenderTarget(resolution[0], resolution[1], { samples: 2 } as ExtendedRenderTargetOptions),
      fboB: new WebGLRenderTarget(resolution[0], resolution[1], { samples: 2 } as ExtendedRenderTargetOptions),
    }

    const depthTexture = new DepthTexture(resolution[0], resolution[1])
    depthTexture.format = DepthFormat;
    depthTexture.type = FloatType
    this.mixDepthPass.fboA.depthTexture = depthTexture
    this.mixDepthPass.material.uniforms.uDepth.value = this.mixDepthPass.fboA.depthTexture;

    this.dummyCamera = new OrthographicCamera()
    this.dummyCamera.position.z = 1

    this.fullScreenTriangle = this.getTriangle()
    this.dummyScene.add(this.fullScreenTriangle)
    this.dummyScene.add(this.dummyCamera)
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

    const triangle = new Mesh(geometry, this.mixDepthPass.material);
    // Our triangle will be always on screen, so avoid frustum culling checking
    triangle.frustumCulled = false;

    return triangle
  }

  public onResize = () => {
    const resolution = new Vector2()
    this.context.renderer.getDrawingBufferSize(resolution);
    this.mixDepthPass.fboA.setSize(resolution.x, resolution.y)
    this.mixDepthPass.fboB.setSize(resolution.x, resolution.y)
    this.mixDepthPass.material.uniforms.uResolution.value.copy(resolution)
  }

  public renderPass(scene: Scene, camera: Camera, fbo: "fboA" | "fboB") {
    this.fullScreenTriangle.material = this.mixDepthPass.material
    this.mixDepthPass.material.uniforms[fbo].value = this.mixDepthPass[fbo].texture
    this.context.renderer.setRenderTarget(this.mixDepthPass[fbo]);
    this.context.renderer.render(scene, camera);
  }

  public renderToScreen() {
    this.context.renderer.setRenderTarget(null)
    this.context.renderer.render(this.dummyScene, this.dummyCamera)
  }

  public transitionScenes() {
    gsap.to(this.mixDepthPass.material.uniforms.uProgression, {
      value: 0.9,
      duration: 4,
      ease: Cubic.easeInOut
    })
    gsap.to(this.mixDepthPass.material.uniforms.uWidth, {
      value: 4,
      duration: 4,
      ease: Cubic.easeInOut
    })
  }

  public tweaks = () => {
    const folder = this.context.pane.addFolder({ title: "Post Processing" })
    folder.addInput(this.mixDepthPass.material.uniforms.uProgression, "value", {
      max: 1,
      min: 0,
      label: 'prog'
    })
    folder.addInput(this.mixDepthPass.material.uniforms.uWidth, "value", {
      max: 1,
      min: 0,
      label: 'width'
    })
    const button = folder.addButton({
      title: 'Transition',
    })
    button.on('click', () => {
      this.transitionScenes()
    });
  }
}
