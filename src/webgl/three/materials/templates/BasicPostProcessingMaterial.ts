import { ShaderMaterial, ShaderMaterialParameters, Uniform } from "three";

const vertexShader = /* glsl */`
    varying vec2 vUv;

    void main() {
        vUv = position.xy * 0.5 + 0.5;
        gl_Position = vec4(position.xy, 1.0, 1.0);
    }
`

const fragmentShader = /* glsl */`
    precision highp float;

    uniform sampler2D uFbo;
    uniform vec2 uResolution;

    varying vec2 vUv;

    void main() {
        vec4 texel = texture2D(uFbo, vUv);

        gl_FragColor = texel;
        // gl_FragColor = vec4(vec3(1., 0., 0.), 1.);
        // gl_FragColor = vec4(vec3(vUv.x, 0., 0.), 1.);
    }
`

export default class BasicPostProcessingMaterial extends ShaderMaterial {
  constructor(shaderOptions?: ShaderMaterialParameters) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uFbo: new Uniform(null)
      },
      ...shaderOptions
    })
  }
}
