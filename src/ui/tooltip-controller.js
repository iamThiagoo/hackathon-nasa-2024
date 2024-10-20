import { Vector3 } from "three";

export function createTooltipController(container) {
  const tooltips = new Map();
  const worldPosition = new Vector3();

  function clear() {
    tooltips.forEach(({ element }) => {
      element.remove();
    });

    tooltips.clear();
  }

  function register(objects) {
    clear();

    objects.forEach((object) => {
      const element = document.createElement("div");
      element.className = "scene-tooltip";
      element.textContent = object.name;

      container.appendChild(element);
      tooltips.set(object.id, { element, object });
    });
  }

  function update(camera) {
    const halfWidth = window.innerWidth / 2;
    const halfHeight = window.innerHeight / 2;

    tooltips.forEach(({ element, object }) => {
      object.sceneObject.getWorldPosition(worldPosition);
      worldPosition.y += 10;
      worldPosition.project(camera);

      const isVisible = worldPosition.z >= -1 && worldPosition.z <= 1;

      if (!isVisible) {
        element.hidden = true;
        return;
      }

      element.hidden = false;
      element.style.left = `${worldPosition.x * halfWidth + halfWidth}px`;
      element.style.top = `${-worldPosition.y * halfHeight + halfHeight}px`;
    });
  }

  return { register, update };
}
