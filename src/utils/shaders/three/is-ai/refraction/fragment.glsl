varying vec2 vUv;

void main(){
	gl_FragColor.rgb = vec3(vUv.x, vUv.y, 0.);
	gl_FragColor.a = 1.;
}