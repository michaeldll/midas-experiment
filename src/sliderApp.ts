import { getGPUTier, TierResult } from "detect-gpu";
import LoadingController from "./DOM/LoadingController";
import "./scss/global.scss";
import { SliderImagesToLoad } from "./types/Images";
import initGL from "./webgl/sliderInitGL";

const init = () => {
  new LoadingController(true);

  (async () => {
    // Always makes a HTTP request, disable for local development
    const gpuTier: TierResult = await getGPUTier();

    // const gpuTier: TierResult = {
    //   tier: 2,
    //   type: "BENCHMARK"
    // };
    const images: SliderImagesToLoad = new Array(20).fill({}).map((value, i)=>{
      return {
        url: `/assets/images/pecha/Slide-${i+1}.png`,
        alt: 'depth'
      }
    })
    console.log(images);
    
    const [controller, tick, cancel] = initGL(document.querySelector(".canvas-gl"), gpuTier, images)
    console.log('gpu tier:', gpuTier)

    tick()
  })();
};

init()

//https://drive.google.com/drive/folders/1BHOwiEiUW1Z5JoeBC0PG55ox_GS3ky9n
//https://twitter.com/AriBenoist/status/1573733088244400130
//https://twitter.com/dh7net/status/1567813168990232578
//https://clipdrop.co/blog/relight-technicalities
//https://github.com/isl-org/MiDaS
//https://github.com/michaeldll/three-fresnel-gltf/blob/master/src/classes/Scene.mjs
//https://webglsamples.org/WebGL2Samples/#transform_feedback_separated_2
//https://www.ibiblio.org/e-notes/webgl/gpu/bounce.htm
//https://gpfault.net/posts/webgl2-particles.txt.html
//https://webgl2fundamentals.org/webgl/lessons/webgl-gpgpu.html
//https://webgl2fundamentals.org/webgl/lessons/resources/webgl-state-diagram.html?exampleId=transform-feedback