import { Texture } from "ogl-typescript";

export type SliderImagesData = { id: number, name: string, texture: Texture }

export type SliderImagesToLoad = { url: string, alt: string }[]