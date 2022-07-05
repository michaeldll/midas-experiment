import { TierResult } from "detect-gpu"
import WebGLController from "./three/WebGLController"

export default function initGL(
  canvas: HTMLCanvasElement,
  gpuTier: TierResult
) {
  const controller = new WebGLController(canvas, gpuTier)

  let raf: number
  const tick = () => {
    controller.tick()
    raf = requestAnimationFrame(tick)
  }
  tick()

  const cancel = () => {
    cancelAnimationFrame(raf)
  }

  return [controller, cancel] as [WebGLController, () => void] // Use these to dispose
}
