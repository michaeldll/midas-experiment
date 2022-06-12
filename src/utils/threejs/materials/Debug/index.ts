import vertexShader from "./index.vert?raw"
import fragmentShader from "./index.frag?raw"

import * as THREE from "three"

export default class Debug {
  public material: THREE.ShaderMaterial
  constructor() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: null },
      },
    })
  }
}
