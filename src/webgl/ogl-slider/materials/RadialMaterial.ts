import { Program, Texture } from "ogl-typescript";

const vertex = /* glsl */ `
  #define PI 3.14159265359

  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  uniform float uDeformFactor;

  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 offsetPosition = position;
    offsetPosition.z += sin(uv.x * PI) * uDeformFactor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(offsetPosition, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uMap;
  uniform float uOpacity;

  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
      vec4 texel = texture2D(uMap, vUv);

      // vec3 normal = normalize(vNormal);
      // float lighting = dot(normal, normalize(vec3(-0.3, 0.8, 0.6)));
      vec3 color = mix(vec3(0.), texel.rgb, uOpacity);

      gl_FragColor.rgb = color;
      gl_FragColor.a = texel.a;

      // gl_FragColor = vec4(vec3(vUv.x, vUv.y, 0.), 1.);
  }
`;

export default class RadialMaterial extends Program {
  constructor(gl, texture: Texture) {
    super(gl, {
      vertex,
      fragment,
      uniforms: {
        uMap: { value: texture },
        uOpacity: { value: 1. },
        uDeformFactor: { value: .2 }
      },
      cullFace: null,
      transparent: false
    });
  }
}
