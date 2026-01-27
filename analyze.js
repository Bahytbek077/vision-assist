exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { image } = JSON.parse(event.body);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Ты помощник для незрячего человека. Опиши окружение ОЧЕНЬ кратко (2-3 предложения).

Фокус на:
- Препятствия (стены, двери, мебель, ступени)
- Люди рядом
- Опасности (лестницы, края)
- Куда можно идти
- Расстояния

Пример: "Впереди коридор. Справа стена в полутора метрах. Прямо можно идти три метра."

Опиши:`
            },
            {
              type: 'image_url',
              image_url: { url: `data:image/jpeg;base64,${image}` }
            }
          ]
        }],
        max_tokens: 200
      })
    });

    const data = await response.json();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ description: data.choices[0].message.content })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};