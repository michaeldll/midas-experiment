import { OGLRenderingContext, Program, Texture, Vec3 } from "ogl-typescript";
import { Config } from "../scenes/SliderScene";

const vertex = /* glsl */ `
  #define PI 3.14159265359

  attribute vec3 position;
  attribute vec3 normal;
  attribute vec2 uv;

  uniform mat4 modelMatrix;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  uniform float uDeformFactor;
  uniform float uDepthFactor;
  uniform sampler2D uDepthMap;

  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    // vec3 offsetPosition = position;
    // offsetPosition.z += sin(uv.x * PI) * uDeformFactor;

    // vec4 depthTexel = texture2D(uDepthMap, uv);
    // offsetPosition.z += depthTexel.r * uDepthFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vWorldPosition = (modelMatrix * vec4(position, 1.)).xyz;
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
  }
`;

const fragment = /* glsl */ `
  #extension GL_OES_standard_derivatives : enable

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

      // vec3 normal = normalize(vNormal);
      // float lighting = dot(normalize(normalTexel.rgb), normalize(uLightPosition));

      // vec3 color = colorTexel.rgb * uBaseColorFactor + lighting * uLightIntensity;
      
      // vec3 opacityColor = mix(vec3(0.), color, uOpacity);

      // gl_FragColor.rgb = opacityColor; 
      // gl_FragColor.a = colorTexel.a;

      gl_FragColor = vec4(vec3(vUv.x, vUv.y, 0.), 1.);
  }
`;

const vertex300 = /* glsl */ `#version 300 es
  in vec3 position;
  in vec2 uv;
  in vec3 normal;

  uniform mat3 normalMatrix;
  uniform mat4 modelMatrix;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform vec3 uLightPosition;

  out vec2 vUv;
  out vec3 vNormal;
  out vec3 vMPos;
  out vec3 vDirectionToLight;

  void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vMPos = (modelMatrix * vec4(position, 1.0)).xyz;
      vDirectionToLight = uLightPosition - vMPos;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment300 = /* glsl */ `#version 300 es
  precision highp float;

  uniform mat4 viewMatrix;
  // uniform float uTime;
  uniform sampler2D uDepthMap;
  uniform sampler2D uColorMap;
  uniform sampler2D uNormalMap;
  uniform float uNormalScale;
  uniform float uNormalUVScale;
  uniform vec3 uLightPosition;
  uniform float uLightIntensity;
  uniform float uBaseColorFactor;

  in vec2 vUv;
  in vec3 vNormal;
  in vec3 vMPos;
  in vec3 vDirectionToLight;

  out vec4 FragColor;

  vec3 getNormal() {
      vec3 pos_dx = dFdx(vMPos.xyz);
      vec3 pos_dy = dFdy(vMPos.xyz);
      vec2 tex_dx = dFdx(vUv);
      vec2 tex_dy = dFdy(vUv);
      vec3 t = normalize(pos_dx * tex_dy.t - pos_dy * tex_dx.t);
      vec3 b = normalize(-pos_dx * tex_dy.s + pos_dy * tex_dx.s);
      mat3 tbn = mat3(t, b, normalize(vNormal));
      vec3 n = texture(uNormalMap, vUv * uNormalUVScale).rgb * 2.0 - 1.0;
      n.xy *= uNormalScale;
      vec3 normal = normalize(tbn * n);
      // Get world normal from view normal
      return normalize((vec4(normal, 0.0) * viewMatrix).xyz);
  }

  vec3 adjustBrightness(vec3 color, float value) {
    return color + value;
  }

  vec3 contrast(vec3 color, float value) {
    return clamp(0.5 + (1.0 + value) * (color - 0.5), vec3(0.), vec3(1.));
  }

  vec3 exposure(vec3 color, float value) {
      return (1.0 + value) * color;
  }

  vec3 hueShift(vec3 color, float hue)
  {
      const vec3 k = vec3(0.57735, 0.57735, 0.57735);
      float cosAngle = cos(hue);
      return vec3(color * cosAngle + cross(k, color) * sin(hue) + k * dot(k, color) * (1.0 - cosAngle));
  }

  void main() {  
      vec4 texel = texture(uColorMap, vUv);

      vec3 normal = getNormal();

      
      vec3 light = normalize(vDirectionToLight);
      float shading = dot(normal, light);
      
      FragColor.rgb = adjustBrightness(texel.rgb, uBaseColorFactor) + shading * uLightIntensity;
      // FragColor.rgb = depthTexel.rgb;
      // FragColor.rgb = normal;
      FragColor.a = 1.0;
  }
`;

export default class MidasMaterial extends Program {
  constructor(gl: OGLRenderingContext, texture: Texture, depthTexture: Texture, normalTexture: Texture, config: Config) {
    super(gl, {
      vertex: vertex300,
      fragment: fragment300,
      uniforms: {
        uColorMap: { value: texture },
        uDepthMap: { value: depthTexture },
        uNormalMap: { value: normalTexture },
        uLightPosition: { value: config.lightPosition },
        uLightIntensity: config.lightIntensity,
        uOpacity: { value: 1. },
        uDeformFactor: { value: .2 },
        uDepthFactor: { value: 0.3 },
        uBaseColorFactor: config.baseColorIntensity,
        uNormalUVScale: { value: 1 },
        uNormalScale: { value: 1 }
      },
      cullFace: null,
      transparent: false
    });
  }
}
