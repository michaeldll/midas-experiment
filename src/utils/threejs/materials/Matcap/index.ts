import vertexShader from "./index.vert?raw"
import fragmentShader from "./index.frag?raw"
import * as THREE from "three"

export default class Matcap {
  public material: THREE.ShaderMaterial

  public load(matcapUrl: string) {
    return new Promise((resolve, reject) => {
      const texture = new THREE.TextureLoader().load(matcapUrl)

      this.material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uMatcap: { value: texture },
        },
      })

      resolve(this.material)

    })
  }
}
