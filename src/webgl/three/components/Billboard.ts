import gsap from "gsap";
import { Color, Mesh, PlaneBufferGeometry, ShaderMaterial, TextureLoader } from "three";
import { AbstractSceneContext } from "../abstract/AbstractScene";
import BillboardMaterial from "../materials/BillboardMaterial";

type Props = {
  context: AbstractSceneContext;
  url: string;
};

export default class Billboard extends Mesh {
  private context: AbstractSceneContext;

  constructor({ context, url }: Props) {
    super(
      new PlaneBufferGeometry(0.707, 1),
      new BillboardMaterial(
        new TextureLoader().load(url),
        {
          transparent: true,
          depthWrite: false,
          depthTest: false
        }
      )
    );

    this.context = context;
  }

  public setActive(toggle: boolean) {
    return gsap.to((this.material as ShaderMaterial).uniforms.uActiveFactor, {
      value: toggle ? 1 : 0
    })
  }

  tick() {
    this.rotation.setFromRotationMatrix(this.context.camera.matrix);
  }
}
