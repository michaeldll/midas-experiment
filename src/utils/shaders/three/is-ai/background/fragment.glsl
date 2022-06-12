uniform float uMixFactor;
uniform vec3 uColorInitial;
uniform vec3 uColorFinal;

void main(){
    gl_FragColor.rgb = mix(uColorInitial, uColorFinal, uMixFactor);    
		gl_FragColor.a = 1.;
}