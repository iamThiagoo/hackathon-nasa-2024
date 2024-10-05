import axios from 'axios';


export async function getDados() {
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
            console.log("==>", dados['2024-10-05'][i]);
      }
      
      // Manipula o sucesso da requisição
    //   console.log(response.data);  // Acesse os dados da resposta aqui
    } catch (error) {
      // Manipula erros da requisição
      console.error('Erro ao buscar dados:', error.response ? error.response.data : error.message);
    } finally {
      // Sempre será executado
      console.log('Requisição finalizada.');
    }
  }