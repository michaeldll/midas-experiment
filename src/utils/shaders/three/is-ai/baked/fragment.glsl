uniform sampler2D uMap;
uniform float uLightIntensity;
varying vec2 vUv;

void main(){
	vec4 texelColor = texture2D(uMap, vUv);
	vec3 texelLitColor = texelColor.xyz += vec3(1. * uLightIntensity,1. * uLightIntensity,1. * uLightIntensity);
	gl_FragColor = vec4(texelLitColor, 1.);
}
