import { requestJson } from "./http-service.js";
import { sanitizeGeneratedHtml } from "../utils/html.js";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o";

function buildAsteroidPrompt(asteroidName) {
  return `informações sobre o asteroide, massa, densidade, gravidade, período de translação, temperatura, luas, atmosfera e curiosidade sobre ${asteroidName}. Monte com base no HTML:
<h1></h1>
<p><strong>Massa:</strong></p>
<p><strong>Densidade:</strong></p>
<p><strong>Gravidade:</strong></p>
<p><strong>Período de translação:</strong></p>
<p><strong>Temperatura:</strong></p>
<p><strong>Luas:</strong></p>
<p><strong>Atmosfera:</strong></p>
<p><strong>Curiosidade:</strong></p>
<p><strong>Fontes:</strong></p>
<ul>
  <li><a href=""></a></li>
</ul>
Retorne apenas o HTML, sem explicações extras.`;
}

export async function fetchAsteroidDetailsHtml(asteroidName) {
  const apiKey = import.meta.env.VITE_OPENAI_KEY?.trim();

  if (!apiKey) {
    throw new Error("A variável VITE_OPENAI_KEY não está configurada.");
  }

  const payload = await requestJson(
    OPENAI_API_URL,
    {
      body: JSON.stringify({
        messages: [
          { role: "user", content: buildAsteroidPrompt(asteroidName) },
        ],
        model: OPENAI_MODEL,
      }),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    },
    "Não foi possível carregar os detalhes do asteroide."
  );

  const content = payload.choices?.[0]?.message?.content ?? "";
  const sanitizedHtml = sanitizeGeneratedHtml(content);

  if (!sanitizedHtml) {
    throw new Error("A resposta da OpenAI veio vazia.");
  }

  return sanitizedHtml;
}
