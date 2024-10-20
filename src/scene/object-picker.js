import { Raycaster, Vector2 } from "three";

const pointer = new Vector2();
const raycaster = new Raycaster();

function isSelectableObject(object) {
  return Boolean(object.name) && !object.isStar && !object.material?.isOrbit;
}

export function pickSceneObject(event, camera, scene) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);

  const intersections = raycaster.intersectObjects(scene.children, true);
  const hit = intersections.find(({ object }) => isSelectableObject(object));

  return hit?.object ?? null;
}
