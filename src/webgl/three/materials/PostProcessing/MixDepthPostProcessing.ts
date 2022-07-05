import { ShaderMaterial, ShaderMaterialParameters, Texture, Vector2, WebGLMultisampleRenderTarget } from "three";

const vertexShader = /*glsl*/`
    void main() {
        // Pass the values directly in clip space coordinates.
        gl_Position = vec4(position.xy, 1.0, 1.0);
    }
`;

const fragmentShader = /*glsl*/`
    precision highp float;

    uniform sampler2D fboA;
    uniform sampler2D fboB;
    uniform sampler2D uDepth;
    uniform vec2 uResolution;
    uniform float uCameraNear;
    uniform float uCameraFar;
    uniform float uProgression;
    uniform float uWidth;

    float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
      return ( viewZ + near ) / ( near - far );
    }

    float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
      return ( near * far ) / ( ( far - near ) * invClipZ - far );
    }

    float readDepth( sampler2D depthSampler, vec2 coord ) {
      // No multisample :
      float fragCoordZ = texture2D( depthSampler, coord ).x;
      // Blurred :
      // float firstBlur = blur5( depthSampler, coord, uResolution * 0.5, vec2(1., 0.) ).x;
      // float secondBlur = blur5( depthSampler, coord, uResolution * 0.5, vec2(0., 1.) ).x;
      // float fragCoordZ = firstBlur * secondBlur;
      float viewZ = perspectiveDepthToViewZ( fragCoordZ, uCameraNear, uCameraFar );
      return viewZToOrthographicDepth( viewZ, uCameraNear, uCameraFar );
    }

    float cubicPulse( float c, float w, float x )
    {
        x = abs(x - c);
        if( x>w ) return 0.0;
        x /= w;
        return 1.0 - x*x*(3.0-2.0*x);
    }

    void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;

        vec4 texelA = texture2D(fboA, st);
        vec4 texelB = texture2D(fboB, st);

        float depth = readDepth( uDepth, st );

        float impulse = cubicPulse(uProgression, uWidth, depth);

        vec3 color = mix(texelA.rgb, texelB.rgb, min(impulse * 2., 1.));

        gl_FragColor = vec4(color, 1.);
        // gl_FragColor = texelA;
        // gl_FragColor = vec4(vec3(1., 0., 0.), 1.);
        // gl_FragColor = vec4(vec3(depth), 1.);
    }
`;

export default class MixDepthPostProcessing extends ShaderMaterial {
    constructor(resolution: number[], shaderOptions?: ShaderMaterialParameters) {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                fboA: { value: null },
                fboB: { value: null },
                uResolution: { value: new Vector2().fromArray(resolution) },
                uDepth: { value: null },
                uCameraNear: { value: 0.1 },
                uCameraFar: { value: 1 },
                uProgression: { value: 0. },
                uWidth: { value: 0.02 }

            },
            ...shaderOptions
        })
    }
}