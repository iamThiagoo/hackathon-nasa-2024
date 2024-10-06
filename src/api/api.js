import axios from 'axios';
import { NEObject } from '../objects';


export async function getDados() {
    let dados_api_asteroide = [];
    try {
      const response = await axios.get('https://api.nasa.gov/neo/rest/v1/feed', {
        params: {
          start_date: '2024-10-05',
          end_date: '2024-10-05',
          api_key: import.meta.env.VITE_API_TOKEN
        }
      });

      const dados = response.data.near_earth_objects

      for(let i=0; i<response.data.element_count; i++){
            let dado = dados['2024-10-05'][i];
            const diameter = (dado.estimated_diameter.kilometers.estimated_diameter_max + dado.estimated_diameter.kilometers.estimated_diameter_min)/2
            const velocity = dado.close_approach_data[0].relative_velocity.kilometers_per_hour;
            const distance = dado.close_approach_data[0].miss_distance.kilometers;

            console.log(diameter, velocity, distance);
            const asteroideObject = new NEObject(dado.id, dado.name, 5660, " asdadas asdsad", 0, 3555, 25, 'moon.jpg',true);

            dados_api_asteroide.push(asteroideObject);
      }
      
      // Manipula o sucesso da requisição
      return dados_api_asteroide;
    } catch (error) {
      // Manipula erros da requisição
      console.error('Erro ao buscar dados:', error.response ? error.response.data : error.message);
    } finally {
      // Sempre será executado
      console.log('Requisição finalizada.');
    }
  }