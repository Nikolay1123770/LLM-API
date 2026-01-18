// api/index.js
export default async function handler(req, res) {
  // 1. Настройка заголовков (CORS) — чтобы браузер не ругался
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Если браузер просто проверяет доступ (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 2. Твой ключ Groq
  const GROQ_KEY = "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";

  try {
    // Читаем данные
    const { messages, model, temperature } = req.body || {};

    // Если данных нет, вернем статус
    if (!messages) {
      return res.status(200).json({ status: "BotHost API is Online 🚀" });
    }

    // Выбираем модель
    const modelMap = {
      "gpt-4o": "llama-3.1-70b-versatile", 
      "llama-3.1-405b": "llama-3.1-405b-reasoning",
      "llama-3.1-70b": "llama-3.1-70b-versatile",
      "mixtral": "mixtral-8x7b-32768"
    };
    
    const targetModel = modelMap[model] || "llama-3.1-70b-versatile";

    // 3. Отправляем запрос в Groq
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
        model: targetModel,
        temperature: temperature || 0.7,
        max_tokens: 4096,
        stream: false
      }),
    });

    const data = await groqResponse.json();

    // Возвращаем ответ на сайт
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
