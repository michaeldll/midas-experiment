uniform sampler2D uMap;
uniform vec3 uFresnelColor;
uniform float uFresnelWidth;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main(){
	// Texel
	vec4 texelColor = texture2D(uMap, vUv);

	// Direction du vertex par rapport a la position de la camera
	vec3 viewDirection = normalize(cameraPosition - vPosition);

	// Angle entre deux vecteurs avec un produit scalaire : 
	// direction d'en haut et la normal
	float fresnelFactor = dot(viewDirection, vNormal);

	// Inverser l'angle
	float inverseFresnelFactor = clamp(1. - fresnelFactor, 0., 1.);
	
	// Shaping function
	inverseFresnelFactor = smoothstep(uFresnelWidth, uFresnelWidth + 0.01, inverseFresnelFactor);
    
	vec3 color = mix(texelColor.rgb, uFresnelColor, inverseFresnelFactor);

	gl_FragColor = vec4(color, 1.); 
}

