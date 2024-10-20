import { escapeHtml } from "../utils/html.js";

function renderSources(sources = []) {
  const items = sources
    .map((source) => {
      const safeSource = escapeHtml(source);

      return `<li><a href="${safeSource}" rel="noopener noreferrer" target="_blank">${safeSource}</a></li>`;
    })
    .join("");

  return `<p><strong>Fontes:</strong></p><ul>${items}</ul>`;
}

export function renderCelestialBodyContent(details) {
  return `
    <h1 class="modal-title">${escapeHtml(details.name)}</h1>
    <p><strong>Massa:</strong> ${escapeHtml(details.mass)}</p>
    <p><strong>Densidade:</strong> ${escapeHtml(details.density)}</p>
    <p><strong>Gravidade:</strong> ${escapeHtml(details.gravity)}</p>
    <p><strong>Período de translação:</strong> ${escapeHtml(details.translation_period)}</p>
    <p><strong>Temperatura:</strong> ${escapeHtml(details.temperature)}</p>
    <p><strong>Luas:</strong> ${escapeHtml(details.moons)}</p>
    <p><strong>Atmosfera:</strong> ${escapeHtml(details.atmosphere)}</p>
    <p><strong>Curiosidade:</strong> ${escapeHtml(details.interesting_fact)}</p>
    ${renderSources(details.sources)}
  `;
}

export function renderAsteroidErrorContent(asteroidName) {
  return `
    <h1 class="modal-title">${escapeHtml(asteroidName)}</h1>
    <p>Não foi possível carregar os detalhes desse asteroide agora.</p>
    <p>Se a chave da OpenAI estiver configurada, tente novamente em alguns instantes.</p>
  `;
}

export function renderUnavailableContent(objectName) {
  return `
    <h1 class="modal-title">${escapeHtml(objectName)}</h1>
    <p>As informações desse objeto não estão disponíveis no momento.</p>
  `;
}
