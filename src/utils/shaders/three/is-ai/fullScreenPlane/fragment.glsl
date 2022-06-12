#define PI 3.14159265359
#pragma glslify: snoise = require('glsl-noise/simplex/3d');

uniform float uTime;
uniform float uAlpha;
uniform float uMixFactor;
uniform vec3 uColorInitial;
uniform vec3 uColorFinal;
uniform vec2 uMousePos; // vec2(0.->1., 0.->1.)
uniform float uAspectHorizontal;
uniform bool uTransitions;
varying vec2 vUv;

vec2 rotate(vec2 uv, float rotation)
{
    float mid = 0.5;
    return vec2(
        cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
        cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}

void main(){
    // Sin & noise
    float freq = 0.0003;
    float amp = 1.;
    float normalizedSin = (sin(uTime * freq) + 1.) / 2.;
    vec2 sinVec = vec2(normalizedSin * amp);
    float noise = snoise(vec3(vUv, sin(uTime * 0.0008)));

    vec2 uv = rotate(vUv, PI * 2. * sinVec.x);

    // Moving target
    vec2 movingTarget = uv - vec2(sinVec.y, 0);
    movingTarget.x *= uAspectHorizontal;
    float distanceTarget = distance(uv, movingTarget);

    vec3 colorMixLoader = mix(uColorInitial, uColorFinal, distanceTarget);
    vec3 colorMixTransitions = mix(uColorFinal, uColorInitial, uMixFactor);    
    vec3 colorLoader = uColorFinal + vec3(clamp(colorMixLoader * noise * uMixFactor, 0., 1.));

    vec3 color;

    // TODO: optimise this by removing if condition
    if(uTransitions) { color = colorMixTransitions; }
    else { color = colorLoader; }

    gl_FragColor = vec4(color, 1.);

    // Debug
    // gl_FragColor = vec4(vec3(uMousePos.x * uMousePos.y, 0., 0.), 1.);
}