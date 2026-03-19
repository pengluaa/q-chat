export function imgLoad(el, binding) {
  const { src, errorSrc } = binding.value;
  /**
   * if src is invalid
   */
  if (!src || src == void 0 || src == "null" || src == "undefined") {
    el.src = errorSrc;
    return;
  }
  el.src = src;
  el.onerror = err => {
    el.src = errorSrc;
  };
}
