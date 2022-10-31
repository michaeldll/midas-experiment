import RadialProject from './RadialProject'
import { SliderSceneContext } from '../scenes/SliderScene'
import ContextComponent from '../abstract/ContextComponent'
import { clamp, lerp } from '../../../utils/math/math'
import { Mesh, Transform, Vec3 } from 'ogl-typescript'
import { SliderImagesData } from '@/types/Images'
import getPerspectiveSize from '@/utils/ogl/misc'

type Props = {
  context: SliderSceneContext
  radius: number
  imagesData: SliderImagesData[]
}

export default class RadialSlider extends ContextComponent<SliderSceneContext> {
  public group = new Transform()
  public radialProjects: RadialProject[] = []
  public marker: Mesh
  public targetAngle = new Vec3()
  public enabled = true
  public speedFactor = 2.5
  public centerOffset = 0
  private spinFactor = 0

  private radius: number

  constructor({
    context,
    radius,
    imagesData
  }: Props) {
    super(context)

    this.radius = radius

    this.setProjects(imagesData)
    // this.centerOffset = this.getCenterOffset() - (1 / imagesData.length * Math.PI * 2)
    this.centerOffset = -14.1375

    this.setEvents()
    this.tweaks()
  }

  private setProjects(imagesData: SliderImagesData[]) {
    for (let index = 0; index < imagesData.length; index++) {
      const { id, name, texture } = imagesData[index]

      const project = new RadialProject({
        context: this.context,
        index,
        radius: this.radius,
        id,
        name,
        texture
      })

      if (index === this.context.state.activeIndex) project.state.active = true

      project.setParent(this.group)
      this.radialProjects.push(project)
    }
  }

  private getCenterOffset() {
    const marker = new Transform()
    // marker.visible = false
    marker.position.z = this.radius
    marker.setParent(this.group)

    const distances = []
    this.group.traverse((obj) => {
      if (!obj.visible) return

      distances.push(marker.position.distance(obj.position))
    })

    const smallest = Math.min(...distances)
    const angle = Math.acos(1 - (smallest * smallest) / (2 * this.radius * this.radius))

    const index = distances.findIndex((value) => { return value === smallest })
    const clampedIndex = Math.max((index - 1), 0)
    const child = this.group.children[clampedIndex]
    const factor = child.position.x > 0 ? -1 : 1

    return factor * angle
  }

  public manageActiveSlide = (nextIndex: number) => {
    this.radialProjects.forEach((project, projectIndex) => {
      if (projectIndex === nextIndex) {
        project.state.active = true
      } else {
        project.state.active = false
      }
    })
  }

  private onActiveIndexChange = (nextIndex: number) => {
    this.goTo(nextIndex)
    this.manageActiveSlide(nextIndex)
  }

  private onSlideReset = (e: CustomEvent) => {
    this.spinFactor += 1
  }

  private setEvents = () => {
    this.context.state.onChange("activeIndex", this.onActiveIndexChange)

    for (const project of this.radialProjects) {
      project.setEvents()
    }

    document.body.addEventListener(
      'slidereset',
      this.onSlideReset,
      false
    )
  }

  private goTo = (nextIndex: number) => {
    this.targetAngle.y = -((nextIndex / this.context.imagesData.length * Math.PI * 2) + (Math.PI * 2 * this.spinFactor))

    document.body.dispatchEvent(new CustomEvent("projectchange", { detail: { index: nextIndex } }))
  }

  public tweaks() {
    const folder = this.context.pane.addFolder({ title: 'Slider' })
    folder.addInput(this, "speedFactor", { min: 0, max: 4, label: "Speed" })

    folder.addInput(this, "targetAngle")
    // folder.addInput(this, "centerOffset")
    // folder.addInput(this.group, "scale")
    // folder.addInput(this.group, "rotation")
  }

  public tick(deltaTime: number, elapsedTime: number) {
    if (!this.enabled || !this.group) return

    const clampedDelta = clamp(deltaTime, 0.001, 0.1)
    this.group.rotation.y = lerp(this.group.rotation.y, this.targetAngle.y + this.centerOffset, clampedDelta * this.speedFactor)

    for (const project of this.radialProjects) {
      project.tick(deltaTime, elapsedTime)
    }
  }
}
