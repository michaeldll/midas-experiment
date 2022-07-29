import { Color, ShaderMaterial, ShaderMaterialParameters, UniformsLib } from "three"

const vertexShader = /*glsl*/`
  #define PI 3.14159265359

  uniform float uDeformationAmplitude;
  // #include <fog_pars_vertex>

  varying vec2 vUv;

  void main() {
    vec3 offsetPosition = position;
    
    offsetPosition.z += sin(uv.x * PI) * uDeformationAmplitude;

    vec4 mPosition = modelMatrix * vec4(offsetPosition, 1.0);
    vec4 mvPosition = viewMatrix * mPosition;

    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;

    // #include <fog_vertex>
  }
`
const fragmentShader = /*glsl*/`
  uniform vec3 uColor;
  uniform float uActiveFactor;

  varying vec2 vUv;

  // #include <fog_pars_fragment>

  void main() {
    gl_FragColor = vec4(uColor, uActiveFactor);

    // Debug UV
    // gl_FragColor = vec4(vec3(vUv.x, 0., 0.), 1.);

    // #include <fog_fragment>
  }
`

export default class TroikaTextMaterial extends ShaderMaterial {
  constructor(color: Color, deformationAmplitude: number, shaderOptions?: ShaderMaterialParameters) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: color },
        uActiveFactor: { value: 0 },
        uDeformationAmplitude: { value: deformationAmplitude }
        // ...UniformsLib["fog"],
      },
      ...shaderOptions
    })
  }
}
