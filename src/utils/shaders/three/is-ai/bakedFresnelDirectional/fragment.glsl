uniform sampler2D uMap;
uniform float uLightIntensity;
uniform vec3 uFresnelColor;
uniform float uPowerOfFactor;
uniform float uMinStep;
uniform float uMaxStep;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main(){
	// Texel
	vec4 texelColor = texture2D(uMap, vUv);
	vec3 texelLitColor = texelColor.xyz += vec3(1. * uLightIntensity, 1. * uLightIntensity, 1. * uLightIntensity);

	//Fresnel
	vec3 viewDirection = normalize(cameraPosition - vec3(vPosition.x, vPosition.y, vPosition.z));
	float fresnelFactor = dot(viewDirection, vNormal);
	float inverseFresnelFactor = clamp(1. - fresnelFactor, 0., 1.);

	// Fresnel shaping function
	// fresnelFactor = pow(fresnelFactor, uPowerOfFactor);
	// inverseFresnelFactor = pow(inverseFresnelFactor, uPowerOfFactor);
	// inverseFresnelFactor = step(uPowerOfFactor, inverseFresnelFactor);

	inverseFresnelFactor = smoothstep(uMinStep, uMaxStep, inverseFresnelFactor);
	inverseFresnelFactor = pow(inverseFresnelFactor, uPowerOfFactor);
	
	gl_FragColor = vec4(clamp(texelLitColor + uFresnelColor * inverseFresnelFactor, 0., 1.), 1.);
	// gl_FragColor =  vec4(texelColor.xyz, 1.);
}

