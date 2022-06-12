uniform vec2 size;
varying vec2 vUv;


void main(){
    vUv = uv;
  
    // gl_Position = vec4(position.x, position.y, 0.0, 1.0);
    gl_Position = vec4(size.x * position.x, size.y * position.y - 0.07, 0.0, 1.0);
}