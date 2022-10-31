
import { SliderSceneContext } from "../scenes/SliderScene"
import RadialMaterial from "../materials/RadialMaterial"
import { Mesh, Plane, Program, Texture, Vec3 } from "ogl-typescript"
import { getProxyState } from "@/utils/misc/misc"
import { clamp, lerp, polarToCartesian } from "@/utils/math/math"

type Props = {
  context: SliderSceneContext
  index: number
  radius: number
  id: number
  texture: Texture
  name: string
  origin?: Vec3
}

export default class RadialProject extends Mesh {
  public polarTarget = new Vec3()
  public slug: string
  public state = getProxyState({ active: false })
  public material: Program
  public index: number

  private target = {
    opacity: 1,
    deformation: 1
  }

  constructor({
    context,
    index,
    texture,
    radius,
    origin = new Vec3()
  }: Props) {
    super(
      context.renderer.gl,
      {
        geometry: new Plane(context.renderer.gl, {
          width: (texture.image as any).width / (texture.image as any).height,
          height: 1,
          widthSegments: 10,
          heightSegments: 10
        }),
        program: new RadialMaterial(context.renderer.gl, texture)
      }
    )

    const [x, y] = polarToCartesian(radius, -index / context.imagesData.length * Math.PI * 2)
    this.polarTarget = new Vec3(x, 0, y)

    this.position.copy(origin)
    this.position.add(this.polarTarget)

    this.lookAt(origin.clone().sub(this.polarTarget))
    this.rotation.y += Math.PI

    this.index = clamp(index, 0, context.imagesData.length)
  }

  public setEvents = () => {
    this.state.onChange("active", (newValue: number) => {
      if (newValue) {
        this.target.opacity = 1
        this.target.deformation = 0
      } else {
        this.target.opacity = 0.1
        this.target.deformation = 0.5
      }
    })
  }

  public tick = (deltaTime: number, elapsedTime: number) => {
    const clampedDelta = clamp(deltaTime, 0.001, 0.1)

    this.program.uniforms.uOpacity.value = lerp(this.program.uniforms.uOpacity.value, this.target.opacity, clampedDelta * 3)
    this.program.uniforms.uDeformFactor.value = lerp(this.program.uniforms.uDeformFactor.value, this.target.deformation, clampedDelta * 2)
  }
}
