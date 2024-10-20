function getRequiredElement(id) {
  const element = document.getElementById(id);

  if (!element) {
    throw new Error(`Expected element with id "${id}" to exist.`);
  }

  return element;
}

export function getDomElements() {
  return {
    appRoot: getRequiredElement("app"),
    closeModalButton: getRequiredElement("close-modal-button"),
    loader: getRequiredElement("loader"),
    modal: getRequiredElement("modal"),
    modalContent: getRequiredElement("modal-content"),
    tooltipLayer: getRequiredElement("tooltip-layer"),
    tutorialDismissButton: getRequiredElement("hide-button"),
    tutorialFooter: getRequiredElement("modal-footer"),
  };
}
