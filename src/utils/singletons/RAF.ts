export enum RAFS {
    MAIN,
};

class RAF {
    callbacks: Map<string | RAFS, (dt: number) => void>;
    prevTime: number;
    rafID: number;

    constructor() {
        this.callbacks = new Map<string | RAFS, (dt: number) => void>();
        this.prevTime = 0;
        this.rafID = 0;
        this.render();
    }

    subscribe = (key: string | RAFS, callback: (dt: number) => void) => {
        // console.log("subscribe : ", key);
        if (this.callbacks.has(key)) console.error(`Duplicate RAF : ${key}`);

        this.callbacks.set(key, callback);
    };

    unsubscribe = (key: string | RAFS) => {
        // console.log("unsubscribe : ", key);
        if (!this.callbacks.has(key))
            console.error(`No such RAF to delete : ${key}`);

        this.callbacks.delete(key);
    };

    render = (time = 0) => {
        this.rafID = requestAnimationFrame(this.render); //TODO: check native time value

        const dt = time - this.prevTime;
        this.callbacks.forEach((cb) => cb(dt));

        this.prevTime = time;
    };
}

const instance = new RAF();
export default instance;

  // if (module.hot)
  //   module.hot.dispose(() => {
  //     for (const iterator of instance.callbacks.keys()) {
  //       instance.unsubscribe(iterator);
  //     }
  //     cancelAnimationFrame(instance.rafID);
  //   });
