attribute vec4 aPosition;
attribute vec4 aVertexColor;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main(void) {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
}