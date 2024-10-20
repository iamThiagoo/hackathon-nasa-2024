import { getCurrentDate } from "../utils/date.js";
import { requestJson } from "./http-service.js";

const NASA_API_URL = "https://api.nasa.gov/neo/rest/v1/feed";
const DEFAULT_NASA_API_KEY = "DEMO_KEY";

export async function fetchAsteroids(date = getCurrentDate()) {
  const params = new URLSearchParams({
    api_key: import.meta.env.VITE_API_TOKEN?.trim() || DEFAULT_NASA_API_KEY,
    end_date: date,
    start_date: date,
  });

  const data = await requestJson(
    `${NASA_API_URL}?${params.toString()}`,
    {},
    "Não foi possível carregar os asteroides do dia."
  );

  const asteroids = data.near_earth_objects?.[date];

  if (!Array.isArray(asteroids)) {
    return [];
  }

  return asteroids.slice(0, 15);
}
