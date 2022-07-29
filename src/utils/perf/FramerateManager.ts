import { getAverage } from "../math/math";


export default class FramerateManager {
  private fps = 0

  // Number of frames to count before averaging things out
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

  public tweaks = (pane, expanded: boolean) => {
    const folder = pane.addFolder({
      title: "FPS",
      expanded: expanded,
    });

    folder.addMonitor(this, "averageFPS")
    folder.addMonitor(this, "averageFPS", {
      view: "graph",
      interval: 100,
      min: 0,
      max: 168,
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

    // Fire callback only once if FPS is under target
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