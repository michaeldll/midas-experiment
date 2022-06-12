uniform sampler2D uMatcap;

varying vec3 vViewPosition;
varying vec3 vNormal;

// #include <fog_pars_fragment>

void main() {
	vec3 normal = normalize( vNormal );

	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;

  vec4 matcap = texture2D( uMatcap, uv );

  vec3 mat = matcap.rgb;

  gl_FragColor = vec4(mat, 1.);

  // #include <fog_fragment>
}