varying vec3 vViewPosition;
varying vec3 vNormal;

// #define EPSILON 1e-6

// #include <fog_pars_vertex>

void main() {

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

	vViewPosition = - mvPosition.xyz;
  vNormal = normalMatrix * normal;

  // #include <fog_vertex>
}