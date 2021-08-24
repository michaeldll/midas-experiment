attribute vec4 aPosition; 
attribute vec3 aNormal;

uniform vec3 uBaseColor;
uniform vec3 uAmbientLight;
uniform vec3 uLightColor;
uniform vec3 uLightDirection;
uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

varying vec3 vColor;

void main() {
    // Angle between normal and light direction
    float normalDotLight = max(dot(uLightDirection, normalize(aNormal)), 0.0);

    // Diffuse light proportional to this angle
    vColor = uLightColor * uBaseColor.rgb * normalDotLight;

    // Ambient light
    vColor *= uAmbientLight;
    vColor += uAmbientLight;

    gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
}