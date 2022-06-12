varying vec2 vUv;

uniform float ratio;
uniform float pi;
uniform sampler2D uRenderTarget;
uniform vec2 resolution;

uniform vec2 size;
uniform float uPixelRatio;
uniform float uLines;
uniform float uThickness;
uniform sampler2D uMap;

vec4 layer(vec4 foreground, vec4 background) {
    return foreground * foreground.a + background * (1.0 - foreground.a);
}

float udRoundBox( vec3 p, vec3 b, float r ){
  return length(max(abs(p)-b,0.0))-r;
}


void main(){
    float textureRatio = 1194.0 / 703.0;
    float r = ratio/textureRatio;

    vec2 textureUv = vec2(fract(vUv.x * r), vUv.y);

    if(textureUv.x < 0.001) textureUv.x = 0.0;

    vec4 texelColor = texture2D(uMap, textureUv);

    vec2 screenUv = (gl_FragCoord.xy / uPixelRatio) / resolution.xy;

    // float lineColor = vec3(0.117, 0.172, 0.282);

    // float wx = (sin(vUv.x*uLines*ratio*(pi/2.0)) + 1.0) * 0.5;
    // wx = step(wx, uThickness);

    // float wy = (sin(vUv.y*uLines*(pi/2.0)) + 1.0) * 0.5;
    // wy = step(wy, uThickness);

    // float lines = wx + wy;
    // lines *= 0.1; 
    texelColor.a *= 0.5;
    vec4 bgColor = vec4(0.019, 0.086, 0.211, 1.0);

 
    // vec3 col = bgColor + lines;
    gl_FragColor = layer(texelColor, bgColor);
    gl_FragColor = layer(texture2D(uRenderTarget, screenUv*size), gl_FragColor);


    vec3 boxPosition = vec3(0.841,0.5,0.0);
    vec3 boxSize = vec3(0.791,0.45,0.0);
    float boxRounding = 0.05;

    vec2 test = vec2(vUv.x * ratio, vUv.y);

    // vec3 curPosition = vec3(test, 0.0);    
    // float dist = udRoundBox(curPosition - boxPosition, boxSize, boxRounding);    
    // float THRESHOLD = 0.0001;
    // float mask = smoothstep(dist-0.001, dist, THRESHOLD);

    // if(mask < 0.0001) discard;
    // gl_FragColor.a *= mask;

    // gl_FragColor.r = mask;
}