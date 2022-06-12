uniform float uTime;

varying vec2 vUv;

void main() {
    // vec3 color = uColor;
    // center image, correct aspect ratio and zoom out slightly
    vec2 uv = 2.0 * vUv - 1.0;
    uv *= 2.;

    // radius of circle
    float r = 1.00; 

    // thickness of circle
    float t = 0.02; 

    // half angle
    float a = (35.0 + 17.0*cos(3.0*uTime));

    // vector from the circle origin to the middle of the arc
    vec2 up = vec2(cos(1.0*uTime), sin(1.0*uTime));
        
    // cos(angle/2.0), where "angle" is the full arc length
    float c = cos(a*3.1416/180.0); 

    // in particular:
    // c =  1.0 gives a 0 degree arc, 
    // c =  0.0 gives a 180 degree arc, 
    // c = -1.0 gives a 360 degree arc

    // smoothing perpendicular to the arc
    float d1 = abs(length(uv) - r) - t;
    float w1 = 2.0*fwidth(d1); // proportional to how much "d1" change between pixels
    float s1 = smoothstep(w1/2.0, -w1/2.0, d1); 

    // smoothing along the arc
    float d2 = dot(up, normalize(uv)) - c;
    float w2 = 2.0*fwidth(d2); // proportional to how much "d2" changes between pixels
    float s2 = smoothstep(w2/2.0, -w2/2.0, d2); 

    // mix perpendicular and parallel smoothing
    float s = s1*(1.0 - s2);

    // coloring
    vec3 lineColor = vec3(1.0, 0.0, 0.0);
    vec3 bgColor   = vec3(0.0, 0.0, 0.0);

    vec3 color = (1.0 - s)*bgColor + s*lineColor;
    gl_FragColor = vec4(color, 1.);

    // Debug color :
    // gl_FragColor = vec4(uColor, 1.);
}