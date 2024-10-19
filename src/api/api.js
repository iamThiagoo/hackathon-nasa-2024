import axios from "axios";
import { NEObject } from "../objects";
import { getCurrentDate } from "../utils/date";

export async function getAsteroids() {
  let dados_api_asteroide = [];
  try {
    const response = await axios.get("https://api.nasa.gov/neo/rest/v1/feed", {
      params: {
        start_date: getCurrentDate(),
        end_date: getCurrentDate(),
        api_key: import.meta.env.VITE_API_TOKEN,
      },
    });

    const dados = response.data.near_earth_objects;

    for (let i = 0; i < response.data.element_count; i++) {
      let dado = dados[getCurrentDate()][i];
      const diameter =
        (dado.estimated_diameter.kilometers.estimated_diameter_max +
          dado.estimated_diameter.kilometers.estimated_diameter_min) /
        2;
      const velocity =
        dado.close_approach_data[0].relative_velocity.kilometers_per_hour;
      const distance = dado.close_approach_data[0].miss_distance.kilometers;

      const asteroideObject = new NEObject(
        dado.id,
        dado.name,
        diameter * 10000,
        0,
        velocity,
        distance,
        "moon.jpg",
        0,
        true
      );

      dados_api_asteroide.push(asteroideObject);
    }

    // Manipula o sucesso da requisição
    return response;
  } catch (error) {
    // Manipula erros da requisição
    console.error(
      "Erro ao buscar dados:",
      error.response ? error.response.data : error.message
    );
  } finally {
    // Sempre será executado
    console.log("Requisição finalizada.");
  }
}
