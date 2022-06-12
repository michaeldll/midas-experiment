import WebGLController from "./three/WebGLController"

export default function initGL(
  canvas: HTMLCanvasElement,
) {
  const controller = new WebGLController(canvas)

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
