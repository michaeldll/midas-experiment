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
    uniform float uTime;
    uniform float uProgress;
    uniform float uRadius;
    uniform float uThickness;
    uniform vec3 uColor;
    uniform vec3 uBackgroundColor;
    varying vec2 vUv;

    void main() {
        // center image, correct aspect ratio and zoom out slightly
        vec2 uv = 2.0 * vUv - 1.0;
        uv *= 1.1;

        // radius of circle
        float r = uRadius; 

        // thickness of circle
        float t = uThickness; 

        // vector from the circle origin to the middle of the arc
        vec2 up = vec2(cos(1.0*uTime), sin(1.0*uTime));
            
        // cos(angle/2.0), where "angle" is the full arc length
        // float c = cos(a*3.1416/180.0); 
        float c = uProgress;

        // in particular:
        // c =  1.0 gives a 0 degree arc, 
        // c =  0.0 gives a 180 degree arc, 
        // c = -1.0 gives a 360 degree arc

        // smoothing perpendicular to the arc
        float d1 = abs(length(uv) - r) - t;
        float w1 = 2.0*fwidth(d1); // proportional to how much "d1" change between pixels
        float s1 = smoothstep(w1/2.0, -w1/2.0, d1); 

        // smoothing along the arc
        float d2 = dot(up, normalize(uv)) - c;
        float w2 = 2.0*fwidth(d2); // proportional to how much "d2" changes between pixels
        float s2 = smoothstep(w2/2.0, -w2/2.0, d2); 

        // mix perpendicular and parallel smoothing
        float s = s1*(1.0 - s2);

        // coloring
        vec3 lineColor = uColor;
        vec3 bgColor   = uBackgroundColor;

        vec3 color = s*lineColor;
        gl_FragColor = vec4(color, s);

        // Debug color :
        // gl_FragColor = vec4(uColor, 1.);
    }
`

export default class CircularArc extends ShaderMaterial {
    constructor(color: Color, shaderOptions?: ShaderMaterialParameters, radius = 1, thickness = 0.02, progress = -1,) {
        super({
            vertexShader,
            fragmentShader,
            uniforms: {
                uColor: { value: color },
                uRadius: { value: radius },
                uThickness: { value: thickness },
                uProgress: { value: progress },
            },
            ...shaderOptions
        })
    }
}
