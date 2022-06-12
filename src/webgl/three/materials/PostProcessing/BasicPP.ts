import { ShaderMaterial, ShaderMaterialParameters, Texture, Vector2, WebGLMultisampleRenderTarget } from "three";

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

    void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;
        vec4 texel = texture2D(uFBO, st);

        gl_FragColor = texel;
        // gl_FragColor = vec4(vec3(1., 0., 0.), 1.);
    }
`;

export default class BasicPostProcessing extends ShaderMaterial {
    constructor(resolution: Vector2, shaderOptions?: ShaderMaterialParameters) {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                uFBO: { value: null },
                uResolution: { value: resolution },
            },
            ...shaderOptions
        })
    }
}
