import { Vector2, Vector3 } from "three"

export const getGrid = (origin = new Vector2(), size = 11, gap = 1) => {
    let index = 0;

    for (let y = origin.y; y > -size - origin.y; y -= gap) {
        for (let x = origin.x; x < size + origin.x; x += gap) {
            const position = new Vector3(x, 0, y);

            index++;
        }
    }
}