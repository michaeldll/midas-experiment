uniform vec3 uFakeLight;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {					
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

	vPosition = position;
	vUv = uv;
	
	// vec3 modNormal = vec3(pow(normal.x, 2.), pow(normal., 2.), 0.);
	// vNormal = normalize(vec3(mat3(modelViewMatrix) * modNormal));
	vNormal = uFakeLight;
}