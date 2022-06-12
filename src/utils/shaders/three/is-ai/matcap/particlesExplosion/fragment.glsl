uniform float time;
uniform float progress;
uniform vec4 resolution;
uniform sampler2D t;
uniform sampler2D t1;

varying vec2 vUv;
uniform vec3 mouse;
varying vec3 vPosition;
float PI = 3.14159265359;

void main(){
    // vec2 newUV = vPosition.xy / vec2(480.*1.5, 820.*1.5) + vec2(0.5);
    // gl_FragColor = vec4(1., 0., 0., 0.);

    
    vec4 tt = texture2D(t, vUv);
    vec4 tt1 = texture2D(t1, vUv);

    vec4 finalTexture = mix(tt, tt1, progress);
    gl_FragColor = finalTexture;
    
    if(gl_FragColor.r < 0.1 && gl_FragColor.b < 0.1 && gl_FragColor.g < 0.1) discard;
    // gl_FragColor = vec4(1.,0.,0.,1.);
}