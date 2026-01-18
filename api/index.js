// Файл: api/index.js
// Родной код для Vercel. Работает вечно.

export const config = {
  runtime: 'edge', // Включает максимальную скорость (Edge Functions)
};

export default async function handler(req) {
  // 1. Настройка CORS (чтобы сайт не ругался)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    // 2. Твой ключ Groq
    const GROQ_KEY = "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";

    // Читаем данные от пользователя
    const body = await req.json().catch(() => ({}));
    
    // Если просто зашли по ссылке
    if (!body.messages) {
      return new Response(JSON.stringify({ status: "BotHost API (Node.js) is Active" }), { status: 200, headers });
    }

    // Маппинг моделей
    const modelMap = {
      "gpt-4o": "llama-3.1-70b-versatile",
      "llama-3.1-405b": "llama-3.1-405b-reasoning",
      "llama-3.1-70b": "llama-3.1-70b-versatile",
      "mixtral": "mixtral-8x7b-32768"
    };

    const requestedModel = body.model || "llama-3.1-70b";
    const targetModel = modelMap[requestedModel] || "llama-3.1-70b-versatile";

    // 3. Запрос к Groq
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: body.messages,
        model: targetModel,
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 4096,
        stream: false
      }),
    });

    const data = await response.json();

    // Отдаем ответ пользователю
    return new Response(JSON.stringify(data), { status: 200, headers });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
  }
}
