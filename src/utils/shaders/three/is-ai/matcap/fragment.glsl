uniform sampler2D uMatcapTexture;
varying vec2 vUv;
varying vec3 vNormal;

void main(){
    // Move normal to view space
    // highp vec2 muv = vec2(viewMatrix * vec4(normalize(vNormal), 0)) * 0.5 + vec2(0.5,0.5);
    // Read texture inverting Y value
    // gl_FragColor = vec4(texture2D(uMatcapTexture, vec2(muv.x, 1.0-muv.y)).xyz, 0.5);
    
    // Debug
    // gl_FragColor = vec4(vec3(muv.x, muv.y, 0.) ,1.);
    // gl_FragColor = vec4(vNormal ,1.);
    gl_FragColor = vec4(vec3(1.,0.,0.) ,1.);
}