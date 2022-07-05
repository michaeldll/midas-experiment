import {
  ShaderMaterial,
  ShaderMaterialParameters,
  Texture,
  UniformsLib,
} from "three";

const vertexShader = /*glsl*/ `
  #include <fog_pars_vertex>

  varying vec2 vUv;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    vUv = uv;

    #include <fog_vertex>
  }
`;
const fragmentShader = /*glsl*/ `
  uniform sampler2D uTexture;
  uniform float uActiveFactor;

  varying vec2 vUv;

  #include <fog_pars_fragment>

  void main() {
    vec4 texel = texture2D(uTexture, vUv);
    gl_FragColor = texel;

    // Debug UV
    // gl_FragColor = vec4(vec3(vUv.x, 0., 0.), 1.);
    #include <fog_fragment>
  }
`;

export default class BillboardMaterial extends ShaderMaterial {
  constructor(texture: Texture, shaderOptions?: ShaderMaterialParameters) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: texture },
        ...UniformsLib["fog"],
      },
      ...shaderOptions,
    });
  }
}
