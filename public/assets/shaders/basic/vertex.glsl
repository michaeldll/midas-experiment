attribute vec4 aPosition;

uniform mat4 uModelMatrix;
uniform mat4 uProjectionMatrix;

void main(void) {
    gl_Position = uProjectionMatrix * uModelMatrix * aPosition;
}