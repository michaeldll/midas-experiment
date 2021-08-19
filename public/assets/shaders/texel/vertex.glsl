attribute vec4 aPosition;
attribute vec4 aVertexColor;
attribute vec2 aUv;

uniform sampler2D uTexture;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vUv;

void main(void) {
    vUv = aUv;
    gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
}