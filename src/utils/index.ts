export function ready(cb: Function) {
  if (document.readyState != 'loading') {
    cb();
  } else {
    document.addEventListener('DOMContentLoaded', (e) => cb());
  }
}