uniform vec2 uSize;
uniform sampler2D uMap;
uniform float uAlpha;

varying vec2 vUv;

void main(){
    vec4 texelColor = texture2D(uMap, vUv);

    
    // gl_FragColor = vec4(1.,0.,vUv);
    gl_FragColor = vec4(texelColor.xyz, uAlpha); 
    // gl_FragColor = vec4(1.,1.,vUv);
}