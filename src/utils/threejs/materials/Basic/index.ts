import vertexShader from "./index.vert?raw"
import fragmentShader from "./index.frag?raw"
import { Color, ShaderMaterial, UniformsLib } from "three"

export default class Basic {
  public material: ShaderMaterial
  constructor(color: Color) {
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: color },
        ...UniformsLib["fog"],
      },
      fog: true,
    })
  }
}
