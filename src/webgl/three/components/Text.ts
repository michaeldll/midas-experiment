import gsap from 'gsap'
import { Color, DoubleSide, Mesh, MeshNormalMaterial, PlaneBufferGeometry } from 'three'
import { AbstractSceneContext } from '../abstract/AbstractScene'
import TextMaterial from '../materials/BasicTroikaTextMaterial'
import AbstractTroikaText from '../abstract/AbstractTroikaText'
import { preloadFont } from 'troika-three-text'
import { ExtendedShaderMaterialOptions } from '@/types/ExtendedShaderMaterialOptions'

type Props = {
  context: AbstractSceneContext
  text: string
  font: string,
  fontSize: number
  deformationAmplitude: number
}

export default class Text extends AbstractTroikaText {
  private context: AbstractSceneContext
  private font: string

  constructor({
    context,
    text,
    font,
    fontSize,
    deformationAmplitude,
  }: Props) {
    super({
      text,
      fontSize,
      anchorX: 'center',
      font,
      material: new TextMaterial(new Color("#fff"), deformationAmplitude, { fog: false, side: DoubleSide, transparent: true } as ExtendedShaderMaterialOptions),
      maxWidth: 2
    })
    this.font = font
    this.context = context
  }

  public setActive(toggle: boolean) {
    if (toggle) {
      this.visible = true
      return gsap.to(this.material.uniforms.uActiveFactor, {
        value: 1
      })
    } else {
      return gsap.to(this.material.uniforms.uActiveFactor, {
        value: 0,
        onComplete: () => {
          this.visible = false
        }
      })
    }
  }

  public faceCamera() {
    (this.rotation as any).setFromRotationMatrix(this.context.camera.matrix);
  }

  public preload(callback: () => void) {
    preloadFont({
      font: this.font,
      characters: "abcdefghijklmnopqrstuvwxyz0123456789"
    }, callback)
  }

  private setDebugMarker() {
    this.add(new Mesh(new PlaneBufferGeometry(0.25, 0.5), new MeshNormalMaterial()))
  }
}
