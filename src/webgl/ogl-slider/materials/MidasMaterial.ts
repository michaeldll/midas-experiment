import { OGLRenderingContext, Program, Texture, Vec3 } from "ogl-typescript";
import { Config } from "../scenes/SliderScene";

const vertex = /* glsl */ `
  #define PI 3.14159265359

  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  uniform float uDeformFactor;
  uniform float uDepthFactor;
  uniform sampler2D uDepthMap;

  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
    vec3 offsetPosition = position;

    offsetPosition.z += sin(uv.x * PI) * uDeformFactor;

    vec4 depthTexel = texture2D(uDepthMap, uv);
    // offsetPosition.z += depthTexel.r * uDepthFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(offsetPosition, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform sampler2D uColorMap;
  uniform sampler2D uDepthMap;
  uniform sampler2D uNormalMap;
  uniform float uOpacity;
  uniform vec3 uLightPosition;
  uniform float uLightIntensity;
  uniform float uBaseColorFactor;

  varying vec3 vNormal;
  varying vec2 vUv;

  void main() {
      vec4 colorTexel = texture2D(uColorMap, vUv);
      vec4 normalTexel = texture2D(uNormalMap, vUv);

      vec3 normal = normalize(vNormal);
      float lighting = dot(normalTexel.rgb, normalize(uLightPosition));

      vec3 color = colorTexel.rgb + lighting * uLightIntensity;
      vec3 opacityColor = mix(vec3(0.), color, uOpacity);

      gl_FragColor.rgb = opacityColor; 
      gl_FragColor.a = colorTexel.a;

      // gl_FragColor = vec4(vec3(vUv.x, vUv.y, 0.), 1.);
  }
`;

export default class MidasMaterial extends Program {
  constructor(gl: OGLRenderingContext, texture: Texture, depthTexture: Texture, normalTexture: Texture, config: Config) {
    super(gl, {
      vertex,
      fragment,
      uniforms: {
        uColorMap: { value: texture },
        uDepthMap: { value: depthTexture },
        uNormalMap: { value: normalTexture },
        uLightPosition: { value: config.lightPosition },
        uLightIntensity: config.lightIntensity,
        uOpacity: { value: 1. },
        uDeformFactor: { value: .2 },
        uDepthFactor: { value: 0.3 },
        uBaseColorFactor: { value: config.baseColorIntensity }
      },
      cullFace: null,
      transparent: false
    });
  }
}
