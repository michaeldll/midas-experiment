import { Matrix4, PerspectiveCamera, Vector3 } from "three";
import { coordinatesToPosition } from "../math/coordinates";
import { clamp } from "../math/math";

export const setMatrixScale = (matrix: Matrix4, scale: Vector3) => {
    const arrayed = matrix.toArray()
    arrayed[0] = scale.x
    arrayed[5] = scale.y
    arrayed[10] = scale.z

    return matrix.fromArray(arrayed)
}

export const getViewport = (camera: PerspectiveCamera) => {
    const fov = camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * camera.position.z;
    const width = height * camera.aspect;

    return {
        height,
        width,
    };
};

export const rectToThree = (
    viewport: { width: number; height: number },
    rect: DOMRect
) => ({
    x: -viewport.width / 2 + (rect.left / window.innerWidth) * viewport.width,
    y: viewport.height / 2 - (rect.top / window.innerHeight) * viewport.height,
    w: viewport.width * (rect.width / window.innerWidth),
    h: viewport.height * (rect.height / window.innerHeight),
});

export function coordinatesToClampedLatitudePos({ coords, maxLat_deg, radius = 1 }) {
    const coordsClamped = [clamp(coords[0], -maxLat_deg, maxLat_deg), coords[1]]

    return new Vector3(...coordinatesToPosition(coordsClamped, radius))
}