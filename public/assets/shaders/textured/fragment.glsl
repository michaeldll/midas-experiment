precision mediump float;

uniform sampler2D uTexture;

varying vec2 vUv;

void main(void) {
    gl_FragColor = texture2D(uTexture, vUv);
}