import { Color, ShaderMaterial, ShaderMaterialParameters } from "three"

const vertexShader = /*glsl*/`
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
    }
`
const fragmentShader = /*glsl*/`
    uniform vec3 uColor;
    varying vec2 vUv;

    float circle(in vec2 _st, in float _radius){
        vec2 dist = _st-vec2(0.5);
        return 1.-smoothstep(_radius-(_radius*0.01),
                            _radius+(_radius*0.01),
                            dot(dist,dist)*4.0);
    }

    void main() {
        vec3 color = vec3(circle(vUv, 0.5));
        color *= uColor;
        gl_FragColor = vec4(color, 1.);
    }
`

export default class Circle extends ShaderMaterial {
    constructor(color: Color, shaderOptions?: ShaderMaterialParameters) {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                uColor: { value: color },
            },
            ...shaderOptions
        })
    }
}
