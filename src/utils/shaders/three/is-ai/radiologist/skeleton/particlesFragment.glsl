uniform sampler2D uMap;
uniform float uAlpha;

varying vec3 fakeColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main(){
    vec4 texelColor = texture2D(uMap, fakeColor.xy);
    gl_FragColor = vec4(texelColor.rgb, uAlpha); 
}