varying vec2 vUv;

void main(){
    vUv = uv;
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    // set if you use THREE.Points
    //  gl_PointSize = 2.;

    gl_Position = projectedPosition;
}