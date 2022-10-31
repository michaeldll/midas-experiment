
import { SliderImagesToLoad } from "@/types/Images"
import { TierResult } from "detect-gpu"
import WebGLController from "./ogl-slider/WebGLController"

export default function initGL(
  canvas: HTMLCanvasElement,
  gpuTier: TierResult,
  images: SliderImagesToLoad
) {
  const controller = new WebGLController(canvas, gpuTier, images)

  let raf: number
  const tick = () => {
    controller.tick()
    raf = requestAnimationFrame(tick)
  }

  const cancel = () => {
    cancelAnimationFrame(raf)
  }

  return [controller, tick, cancel] as [WebGLController, () => void, () => void]
}
