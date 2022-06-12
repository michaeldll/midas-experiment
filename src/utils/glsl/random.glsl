  float rand(float n){return fract(sin(n) * 43758.5453123);}

  float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
  }