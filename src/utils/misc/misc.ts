export function ready(cb: Function) {
  if (document.readyState != 'loading') {
    cb();
  } else {
    document.addEventListener('DOMContentLoaded', (e) => cb());
  }
}

/**
 * @description Check for touch-capability
 */
export function isTouchDevice() {
  try {
    document.createEvent("TouchEvent");
    return true;
  } catch (e) {
    return false;
  }
}

/**
* @returns Max FPS tied to Screen refresh rate
* getMaxFPS().then(fps => ...);
*/
export const getMaxFPS = () =>
  new Promise((resolve) =>
    requestAnimationFrame((t1) =>
      requestAnimationFrame((t2) => resolve(1000 / (t2 - t1)))
    )
  );

export function throttle(func: Function, limit: number) {
  let inThrottle
  return function () {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function debounce(func: Function, delay: number) {
  let inDebounce
  return function () {
    const context = this
    const args = arguments
    clearTimeout(inDebounce)
    inDebounce = setTimeout(() => func.apply(context, args), delay)
  }
}

export function getProxyState<T>(fromState: T) {
  const callbacks = new Map();

  const handler = {
    set(obj: Object, propName: string, value: any) {
      const previousValue = obj[propName];
      obj[propName] = value;
      for (const callback of callbacks.get(propName) || [])
        callback(value, previousValue);
      return true;
    },
  };

  const target: typeof fromState & {
    onChange: (propName: string, callback: Function) => Function;
  } = {
    onChange: (propName: string, callback: Function) => {
      if (!callbacks.has(propName)) callbacks.set(propName, []);
      callbacks.get(propName).push(callback);

      return () => {
        const arr = callbacks.get(propName);
        const index = arr.indexOf(callback);
        arr.splice(index, 1);
        if (arr.length === 0) callbacks.delete(propName);
      };
    },
    ...fromState,
  };

  const proxied: typeof fromState & {
    onChange: (propName: string, callback: Function) => Function;
  } = new Proxy(target, handler) as any;
  
  return proxied;
}

export function isBetween(max: number, min?: number) {
  if (typeof min === "undefined") return window.matchMedia(`(max-width: ${max}px)`).matches
  else {
    return window.matchMedia(`(min-width: ${min}px) and (max-width: ${max}px)`).matches
  }
}