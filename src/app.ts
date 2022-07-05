import { getGPUTier, TierResult } from "detect-gpu";
import "./scss/global.scss";
import initGL from "./webgl/initGL";

const init = () => {
  (async () => {
    const gpuTier: TierResult = await getGPUTier();

    const [controller, cancelRAF] = initGL(document.querySelector(".canvas-gl"), gpuTier)

    console.info("here is your GPU tier, you're welcome: ", gpuTier);
  })();

};

init()