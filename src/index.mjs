import { ready } from "./utils/index.mjs";
import { Pane } from "tweakpane"
import initGL from "./ogl/cube.mjs"
import './scss/global.scss'

const init = () => {
    const pane = new Pane()
    initGL(pane)
}

ready(init)