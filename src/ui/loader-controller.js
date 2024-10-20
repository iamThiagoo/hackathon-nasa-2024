export function createLoaderController(element) {
  const defaultBackgroundColor = getComputedStyle(element).backgroundColor;

  function show(backgroundColor = defaultBackgroundColor) {
    element.style.backgroundColor = backgroundColor;
    element.style.display = "flex";
  }

  function hide() {
    element.style.backgroundColor = defaultBackgroundColor;
    element.style.display = "none";
  }

  return { hide, show };
}
