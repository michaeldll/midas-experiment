    // float roundBox( vec3 position, vec3 box, float radius )
    // {
    //     return length(max(abs(position)-box,0.0))-radius;
    // }

    //---------------------------------------------------------
    // draw rectangle frame with rounded edges
    //---------------------------------------------------------
    // float roundedFrame (vec2 pos, vec2 size, float radius, float thickness)
    // {
    //     float d = length(max(abs(vUv - pos),size) - size) - radius;
    //     return smoothstep(0.55, 0.45, abs(d / thickness) * 5.0);
    // }

    // // from http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
    // float udRoundBox( vec2 p, vec2 b, float r )
    // {
    //     return length(max(abs(p)-b+r,0.0))-r;
    // }