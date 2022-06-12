uniform vec2 uSize;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    // gl_Position = vec4(position.x, position.y, 0.0, 1.0);
}