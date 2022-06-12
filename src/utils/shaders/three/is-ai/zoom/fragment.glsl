uniform sampler2D t;
uniform float ratio;
uniform vec2 zoomRatio;
uniform float scale;
varying vec2 vUv;

// #define PI 3.1415926535897932384626433832795;

void main(){
    vec2 uv = vUv;
    uv = (vUv - 0.5) / zoomRatio * 1.0 / scale + 0.5;

    float strength = 1.0 - step(0.5, distance(vUv, vec2(0.5)));
    strength = clamp(strength, 0.0, 1.0);

    vec4 blackColor = vec4(0.0);
    
    vec4 uvColor = texture2D(t, uv);
    vec4 mixedColor = mix(blackColor, uvColor, strength);
    mixedColor.a = strength;

    gl_FragColor = mixedColor;
    gl_FragColor.r = 1.0;
    // gl_FragColor = vec4(vUv, 0.,1.);
}