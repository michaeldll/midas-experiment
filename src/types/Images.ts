import { Texture } from "ogl-typescript";

export type SliderImagesData = { id: number, name: string, texture: Texture, depthTexture: Texture, normalTexture: Texture }

export type SliderImagesToLoad = { url: string, depthUrl: string, normalUrl: string, alt: string }[]