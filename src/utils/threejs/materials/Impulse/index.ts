import { Color, DoubleSide, ShaderMaterial, Texture, UniformsLib } from "three"

export default class Impulse {
  public material: ShaderMaterial
  constructor(texture: Texture, color = new Color("#ffd579"),) {
    this.material = new ShaderMaterial({
      vertexShader: /*glsl*/ `
        uniform float uTime;
        uniform float uProgression;
        uniform float uImpulseWidth;
        varying vec2 vUv;
        varying float vImpulse;
    
        float remap(float value, float start1, float stop1, float start2, float stop2) {
            return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
        }
    
        float cubicPulse( float c, float w, float x )
        {
            x = abs(x - c);
            if( x>w ) return 0.0;
            x /= w;
            return 1.0 - x*x*(3.0-2.0*x);
        }
    
        void main(void) {
          // Needs remaping to get a pleasant visual progression
          float progression = remap(uProgression, 0., 1., -1.3, 1.7);
          
          float impulse = cubicPulse(progression, uImpulseWidth, uv.y);
          
          vec3 offset = vec3(0.);
          offset.y = impulse * 0.1;
          
          vImpulse = impulse;
          vUv = uv;
    
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position + offset, 1.0);
        }
      `,
      fragmentShader: /*glsl*/ `
        varying vec2 vUv;
        varying float vImpulse;
    
        uniform vec3 uTint;
        uniform sampler2D uTexture;
        uniform float uAlphaMultiplier;
    
        void main(void) {
          vec4 texel = texture2D(uTexture, vUv);
          vec3 color = mix(texel.rgb, texel.rgb * uTint, vImpulse);
          gl_FragColor = vec4(color, texel.a * uAlphaMultiplier);
          // gl_FragColor = vec4(vec3(vImpulse), 1.);
          // gl_FragColor = texel;
        }
      `,
      uniforms: {
        uTexture: { value: texture },
        uTime: { value: 0 },
        uTint: { value: color },
        uProgression: { value: 0 },
        uAlphaMultiplier: { value: 0 },
        uImpulseWidth: { value: 0.7 }
      },
      transparent: true,
      side: DoubleSide
    });
  }
}


