import { getCelestialDetails } from "../data/celestial-details.js";
import { fetchAsteroidDetailsHtml } from "../services/openai-service.js";
import {
  renderAsteroidErrorContent,
  renderCelestialBodyContent,
  renderUnavailableContent,
} from "./templates.js";

export function createModalController({
  closeModalButton,
  loader,
  modal,
  modalContent,
  tutorialFooter,
  tutorialDismissButton,
}) {
  let hasSeenTutorial = false;
  let isRequestInFlight = false;

  closeModalButton.addEventListener("click", closeModal);
  tutorialDismissButton.addEventListener("click", () => {
    markTutorialAsSeen();
    closeModal();
  });

  function markTutorialAsSeen() {
    if (hasSeenTutorial) {
      return;
    }

    closeModalButton.classList.add("is-visible");
    tutorialFooter.hidden = true;
    hasSeenTutorial = true;
  }

  function closeModal() {
    modal.style.display = "none";
  }

  function openModal() {
    modal.style.display = "block";
  }

  function setContent(html) {
    modalContent.innerHTML = html;
  }

  async function showObjectDetails(sceneObject) {
    if (isRequestInFlight) {
      return;
    }

    markTutorialAsSeen();

    if (sceneObject.isAsteroid) {
      isRequestInFlight = true;
      loader.show("rgba(6, 6, 6, 0.59)");

      try {
        setContent(await fetchAsteroidDetailsHtml(sceneObject.name));
      } catch (error) {
        console.error(error);
        setContent(renderAsteroidErrorContent(sceneObject.name));
      } finally {
        loader.hide();
        isRequestInFlight = false;
      }

      openModal();
      return;
    }

    const details = getCelestialDetails(sceneObject.name);

    setContent(
      details
        ? renderCelestialBodyContent(details)
        : renderUnavailableContent(sceneObject.name)
    );
    openModal();
  }

  return {
    isBusy: () => isRequestInFlight,
    showObjectDetails,
  };
}
