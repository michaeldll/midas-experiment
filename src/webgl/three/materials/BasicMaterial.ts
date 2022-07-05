import { Color, ShaderMaterial, ShaderMaterialParameters, UniformsLib } from "three"

const vertexShader = /*glsl*/`
  #include <fog_pars_vertex>

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    #include <fog_vertex>
  }
`
const fragmentShader = /*glsl*/`
  uniform vec3 uColor;

  #include <fog_pars_fragment>

  void main() {
    vec3 color = uColor;
    gl_FragColor = vec4(color, 1.);

    #include <fog_fragment>
  }
`

export default class Basic extends ShaderMaterial {
  constructor(color: Color, shaderOptions?: ShaderMaterialParameters) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: color },
        ...UniformsLib["fog"],
      },
      ...shaderOptions
    })
  }
}
