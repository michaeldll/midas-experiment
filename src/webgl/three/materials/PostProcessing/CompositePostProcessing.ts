import { ShaderMaterial, ShaderMaterialParameters, Vector2, WebGLMultisampleRenderTarget } from "three";
import layer from "../../../../utils/glsl/layer.glsl"

const vertexShader = /*glsl*/`
    void main() {
        // Pass the values directly in clip space coordinates.
        gl_Position = vec4(position.xy, 1.0, 1.0);
    }
`;

const fragmentShader = /*glsl*/`
    precision highp float;

    ${layer}

    uniform sampler2D uFirstFBO;
    uniform sampler2D uSecondFBO;
    uniform vec2 uResolution;

    void main() {
        vec2 st = gl_FragCoord.xy / uResolution.xy;

        vec4 firstTexel = texture2D(uFirstFBO, st);
        vec4 secondTexel = texture2D(uSecondFBO, st);
        // gl_FragColor = layer(firstTexel, secondTexel);
        // gl_FragColor = vec4(vec3(st.x, 0., 0.), 1.);

        // vec4 color = mix(firstTexel, secondTexel, 1. - firstTexel.a);
        // gl_FragColor = color;

        // gl_FragColor = firstTexel;

        gl_FragColor = vec4(vec3(st.x, 0., 0.), 1.);
    }
`;

export default class CompositePostProcessing extends ShaderMaterial {
    constructor(resolution: Vector2, firstFBO: WebGLMultisampleRenderTarget, secondFBO: WebGLMultisampleRenderTarget, shaderOptions?: ShaderMaterialParameters) {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                uFirstFBO: { value: firstFBO.texture },
                uSecondFBO: { value: secondFBO.texture },
                uResolution: { value: resolution },
            },
            ...shaderOptions
        })
    }
}
