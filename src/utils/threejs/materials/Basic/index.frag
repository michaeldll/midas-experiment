uniform vec3 uColor;

#include <fog_pars_fragment>

void main() {
	vec3 color = uColor;
  gl_FragColor = vec4(color, 1.);

  #include <fog_fragment>
}