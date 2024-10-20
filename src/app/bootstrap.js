import { fetchAsteroids } from "../services/nasa-service.js";
import { delay } from "../utils/delay.js";
import { getDomElements } from "../ui/dom-elements.js";
import { createLoaderController } from "../ui/loader-controller.js";
import { createModalController } from "../ui/modal-controller.js";
import { createTooltipController } from "../ui/tooltip-controller.js";
import { createSceneContext } from "../scene/create-scene-context.js";
import { createSun, createStarField } from "../scene/background.js";
import { pickSceneObject } from "../scene/object-picker.js";
import {
  addObjectsToScene,
  animateObjects,
  createAsteroidObjects,
  createPlanetObjects,
} from "../scene/solar-system.js";

const LOADER_MIN_DURATION_MS = 1000;

function isUiClick(target) {
  return target instanceof Element && Boolean(target.closest("#modal"));
}

export async function bootstrapApp() {
  const elements = getDomElements();
  const loader = createLoaderController(elements.loader);
  const modalController = createModalController({
    closeModalButton: elements.closeModalButton,
    loader,
    modal: elements.modal,
    modalContent: elements.modalContent,
    tutorialFooter: elements.tutorialFooter,
    tutorialDismissButton: elements.tutorialDismissButton,
  });

  const sceneContext = createSceneContext({ container: elements.appRoot });
  const starField = createStarField();
  const sun = createSun();

  sceneContext.scene.add(starField);
  sceneContext.scene.add(sun);

  const planetObjects = createPlanetObjects();

  let asteroidData = [];
  try {
    asteroidData = await fetchAsteroids();
  } catch (error) {
    console.error(error);
  }

  const asteroidObjects = createAsteroidObjects(asteroidData);
  const orbitingObjects = [...planetObjects, ...asteroidObjects];

  addObjectsToScene(sceneContext.scene, orbitingObjects);

  const tooltipController = createTooltipController(elements.tooltipLayer);
  tooltipController.register(orbitingObjects);

  window.addEventListener("click", async (event) => {
    if (isUiClick(event.target) || modalController.isBusy()) {
      return;
    }

    const selectedObject = pickSceneObject(
      event,
      sceneContext.camera,
      sceneContext.scene
    );

    if (!selectedObject) {
      return;
    }

    await modalController.showObjectDetails(selectedObject);
  });

  function animate() {
    requestAnimationFrame(animate);

    animateObjects(orbitingObjects);
    tooltipController.update(sceneContext.camera);
    sun.rotation.y += 0.001;

    sceneContext.controls.update();
    sceneContext.renderer.render(sceneContext.scene, sceneContext.camera);
  }

  sceneContext.renderer.render(sceneContext.scene, sceneContext.camera);
  animate();

  await delay(LOADER_MIN_DURATION_MS);
  loader.hide();
}
