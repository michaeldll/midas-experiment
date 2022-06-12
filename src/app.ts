import "./scss/global.scss";
import initGL from "./webgl/initGL";

const init = () => {
  initGL(document.querySelector(".canvas-gl"))
};

init()