import axios from 'axios';

export async function sendMessage(prompt) {
    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-4o',
                messages: [
                    {"role": "user", "content": prompt}
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}` // Chave da API
                }
            }
        );
  
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Erro ao chamar a API OpenAI:', error.response ? error.response.data : error.message);
    }
}