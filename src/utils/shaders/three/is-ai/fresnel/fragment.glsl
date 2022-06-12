varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

varying vec3 vPositionW;
varying vec3 vNormalW;

uniform vec3 uBaseColor;
uniform vec3 uFresnelColor;
uniform float uFresnelWidth;

void main(){
    // Direction du vertex par rapport a la position de la camera
    vec3 viewDirection = normalize(cameraPosition - vPosition);

    // Angle entre deux vecteurs avec un produit scalaire : 
    // direction d'en haut et la normal
    float fresnelFactor = dot(viewDirection, vNormal);

    // Inverser l'angle
    float inverseFresnelFactor = clamp(1. - fresnelFactor, 0., 1.);

    // Shaping function
    // inverseFresnelFactor = step(uFresnelWidth, inverseFresnelFactor);
    inverseFresnelFactor = pow(inverseFresnelFactor, 3.);

    vec3 color = mix(uBaseColor, uFresnelColor, inverseFresnelFactor);

    gl_FragColor = vec4(color, 1.); 
}
