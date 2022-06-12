import { Color, Material } from 'three'
import { Text } from 'troika-three-text'

type TroikaOptions = {
  text?: string,
  fontSize?: number,
  color?: any,
  anchorX?: number | 'left' | 'center' | 'right',
  font?: string,
  material?: Material
  strokeWidth?: number
  strokeColor?: Color
  maxWidth?: number
  lineHeight?: number
  letterSpacing?: number
  textAlign?: 'left' | 'right' | 'center' | 'justify'
  anchorY?: number | 'top' | 'top-baseline' | 'middle' | 'bottom-baseline' | 'bottom'
  clipRect?: [number, number, number, number]
  depthOffset?: number
  direction?: 'auto' | 'ltr' | 'rtl'
  overflowWrap?: 'normal' | 'break-word'
  whiteSpace?: 'normal' | 'overflowWrap' | 'overflowWrap'
  outlineWidth?: number | string
  outlineOffsetX?: number | string
  outlineOffsetY?: number | string
  outlineBlur?: number | string
  outlineColor?: any
  outlineOpacity?: number
  strokeOpacity?: number
  fillOpacity?: number
  debugSDF?: boolean
}

export default abstract class AbstractTroikaText extends Text {
  constructor(options: TroikaOptions) {
    super()

    for (const entry of Object.entries(options)) {
      this[entry[0]] = entry[1]
    }

    this.sync()
  }
}