import { ShaderMaterialParameters } from "three"

export type ExtendedShaderMaterialOptions = ShaderMaterialParameters & {
    fog: boolean
}