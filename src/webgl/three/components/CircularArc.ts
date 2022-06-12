import { Color, Mesh, PlaneBufferGeometry, ShaderMaterial } from "three"
import { clamp, lerp, map } from "../../../utils/math/math"
import { AbstractSceneContext } from "../abstract/AbstractScene"
import CircularArcMaterial from "../materials/CircularArc"

type Props = {
    context: AbstractSceneContext
}

export default class CircularArc extends Mesh {
    public progress = {
        previous: 1,
        current: 1
    }
    private context: AbstractSceneContext

    constructor({
        context,
    }: Props) {
        super(
            new PlaneBufferGeometry(),
            new CircularArcMaterial(
                new Color("#fff"),
                {
                    depthWrite: false,
                    depthTest: false,
                    transparent: true
                }
            )
        )
        this.context = context
    }

    public setProgress(newValue: number) {
        this.progress.previous = newValue
    }

    public faceCamera() {
        (this.rotation as any).setFromRotationMatrix(this.context.camera.matrix);
    }

    public tick = () => {
        this.progress.current = map(this.progress.current, -1, 1, -1.00002, 1.00002)
        this.progress.current = lerp(this.progress.current, this.progress.previous, 0.1);
        (this.material as ShaderMaterial).uniforms.uProgress.value = this.progress.current
    }
}
