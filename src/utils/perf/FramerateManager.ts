import { getAverage } from "../math/math";

class FramerateManager {
  private arrayFPS = [];
  private averageFPS = 0;

  private targetFPS: number;
  private underTargetCallback: Function;

  public isUnderTarget = false;

  constructor({ targetFPS, underTargetCallback }) {
    this.targetFPS = targetFPS;
    this.underTargetCallback = underTargetCallback;
  }

  public tweaks = (pane) => {
    const folder = pane.addFolder({
      title: "Performance",
      expanded: false,
    });

    folder.addMonitor(this, "averageFPS", {
      view: "graph",
      interval: 1000,
      min: 0,
      max: 1000,
    });
  };

  public manageFPS(deltaTime: number) {
    if (this.isUnderTarget) return;

    const fps = 1000 / deltaTime;

    if (this.arrayFPS.length < 300) {
      this.arrayFPS.push(fps);
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

export default FramerateManager;
