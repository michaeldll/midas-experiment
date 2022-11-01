import { Camera, OGLRenderingContext, Texture } from "ogl-typescript";

export const getViewport = (camera: Camera) => {
  const fov = camera.fov * (Math.PI / 180);
  const height = 2 * Math.tan(fov / 2) * camera.position.z;
  const width = height * camera.aspect;

  return {
    height,
    width,
  };
};

// AKA: Camera viewport at distance
export function getPerspectiveSize(camera: Camera, distance: number) {
  const vFOV = camera.fov * Math.PI / 180
  const height = 2 * Math.tan(vFOV / 2) * Math.abs(distance)
  const aspect = camera.aspect
  const width = height * aspect

  return { width, height }
}

export function loadTexture(gl: OGLRenderingContext, url: string): Promise<Texture> {
  return new Promise((resolve) => {
    const texture = new Texture(gl);
    const img = new Image();
    img.crossOrigin = "Anonymous"
    img.onload = () => {
      texture.image = img
      resolve(texture)
    };
    img.src = url;
  })
}