export function ready(cb) {
  if (document.readyState != 'loading') {
    cb();
  } else {
    document.addEventListener('DOMContentLoaded', cb);
  }
}