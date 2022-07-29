import { ShaderMaterial, ShaderMaterialParameters, Vector2 } from "three";
import blur from "../../../../utils/glsl/blur.glsl"

const vertexShader = /*glsl*/`
    void main() {
        // Pass the values directly in clip space coordinates.
        gl_Position = vec4(position.xy, 1.0, 1.0);
    }
`;

const fragmentShader = /*glsl*/`
    precision highp float;

    uniform sampler2D uFBO;
    uniform vec2 uResolution;
    uniform vec2 uBlurDirection;

    ${blur}

    void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        vec4 texel = texture2D(uFBO, st);

        vec4 blurred = blur9(uFBO, st, uResolution.xy, uBlurDirection);
        
        vec4 color = mix(texel, blurred, texel.b);
        
        gl_FragColor = color;
        // gl_FragColor = texel;
        // gl_FragColor = vec4(vec3(uBlurDirection.x, uBlurDirection.y, 0.), 1.);
    }
`;

export default class BlurPostProcessing extends ShaderMaterial {
  constructor(resolution: Vector2, blurDirection: Vector2, shaderOptions?: ShaderMaterialParameters) {
    super({
      vertexShader,
      fragmentShader,
      uniforms: {
        uFBO: { value: null },
        uResolution: { value: resolution },
        uBlurDirection: { value: blurDirection }
      },
      ...shaderOptions
    })
  }
}
