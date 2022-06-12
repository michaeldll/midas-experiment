import { WebGLRenderTargetOptions } from "three"

export type ExtendedRenderTargetOptions = WebGLRenderTargetOptions & {
    samples: number
  }