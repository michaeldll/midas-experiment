
import { Color, ShaderMaterial, ShaderMaterialParameters, UniformsLib } from "three"
import snoise3d from "../../../../lib/glsl/snoise3d.glsl"

const vertexShader = /*glsl*/`
  #include <fog_pars_vertex>

  attribute float aLifetime;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vLifeTime;

  ${snoise3d}

  void main() {
    vec4 modelViewInstancePosition = viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);

    // modelViewInstancePosition.y += sin(uTime * 3.14159) * 0.1;
    // modelViewInstancePosition.y += snoise(vec3(modelViewInstancePosition.yz, uTime));

    vWorldPos = modelViewInstancePosition.xyz;
    
    vNormal = normal;
    vLifeTime = aLifetime;
    gl_Position = projectionMatrix * modelViewInstancePosition;
    
    #include <fog_vertex>
  }
`
const fragmentShader = /*glsl*/`
  uniform vec3 uColor;

  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vLifeTime;

  #include <fog_pars_fragment>

  void main() {
    // vec3 color = vec3(vWorldPos.y);
    gl_FragColor = vec4(uColor, 1.-vLifeTime);
    // gl_FragColor = vec4(vNormal, 1.);

    #include <fog_fragment>
  }
`

export default class InstancedParticles extends ShaderMaterial {
  constructor(color: Color, shaderOptions?: ShaderMaterialParameters) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uColor: { value: color },
        uLightColor: { value: new Color("white") },
        uTime: { value: 0 },
        ...UniformsLib["fog"],
      },
      transparent: true,
      ...shaderOptions
    })
  }
}
