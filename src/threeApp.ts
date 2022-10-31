import { getGPUTier, TierResult } from "detect-gpu";
import LoadingController from "./DOM/LoadingController";
import "./scss/global.scss";
import initGL from "./webgl/initGL";

const init = () => {
  new LoadingController(true);

  (async () => {
    // Always makes a HTTP request, disable for local development
    const gpuTier: TierResult = await getGPUTier();

    // const gpuTier: TierResult = {
    //   tier: 2,
    //   type: "BENCHMARK"
    // };

    const [controller, cancelRAF] = initGL(document.querySelector(".canvas-gl"), gpuTier)

    console.log('gpu tier:', gpuTier)
  })();
};

init()