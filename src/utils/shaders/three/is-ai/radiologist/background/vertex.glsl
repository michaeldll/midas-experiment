uniform vec2 size;

void main(){
    gl_Position = vec4(size * position.xy, 0.0, 1.0);
}