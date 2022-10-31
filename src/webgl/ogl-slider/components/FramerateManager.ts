import { getAverage } from "@/utils/math/math";

export default class FramerateManager {
  private fps = 0

  private count = 50;
  private arrayFPS = [];
  private averageFPS = 0;

  private targetFPS: number;
  private underTargetCallback: Function;

  public isUnderTarget = false;

  constructor({ targetFPS, underTargetCallback = () => { } }) {
    this.targetFPS = targetFPS;
    this.underTargetCallback = underTargetCallback;
  }

  public tweaks = (pane) => {
    const folder = pane.addFolder({
      title: "FPS",
      expanded: true,
    });

    folder.addMonitor(this, "averageFPS", { label: "Average FPS" })
    folder.addMonitor(this, "averageFPS", {
      view: "graph",
      interval: 100,
      min: 0,
      max: 168,
      label: "Average FPS over time"
    });

    // folder.addMonitor(this, "fps")
    // folder.addMonitor(this, "fps", {
    //   view: "graph",
    //   interval: 100,
    //   min: 0,
    //   max: 144,
    // });
  };

  public tick(deltaTime: number) {
    this.fps = 1 / deltaTime;

    if (this.arrayFPS.length < this.count) {
      this.arrayFPS.push(this.fps);
    } else {
      this.averageFPS = getAverage(this.arrayFPS);
      this.arrayFPS = [];
    }

    if (
      this.averageFPS !== 0 &&
      this.averageFPS < this.targetFPS &&
      !this.isUnderTarget
    ) {
      this.underTargetCallback();
      this.isUnderTarget = true;
    }
  }
}
