// api/index.js
export const config = {
  runtime: 'edge', // Включаем режим Edge (работает быстрее и надежнее)
};

export default async function handler(req) {
  // 1. CORS (чтобы сайт работал)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  // Если браузер проверяет доступ
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    const GROQ_KEY = "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";

    // Получаем данные из запроса
    const body = await req.json().catch(() => ({}));
    const messages = body.messages;

    // Если открыли ссылку в браузере без данных
    if (!messages) {
      return new Response(
        JSON.stringify({ status: "BotHost API (Edge) is Online 🟢" }), 
        { status: 200, headers }
      );
    }

    // Выбираем модель
    const modelMap = {
      "gpt-4o": "llama-3.1-70b-versatile",
      "llama-3.1-405b": "llama-3.1-405b-reasoning",
      "llama-3.1-70b": "llama-3.1-70b-versatile",
    };
    const targetModel = modelMap[body.model] || "llama-3.1-70b-versatile";

    // Делаем запрос к Groq
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
        model: targetModel,
        temperature: 0.7,
        max_tokens: 4096
      }),
    });

    const data = await groqResponse.json();

    // Возвращаем ответ
    return new Response(JSON.stringify(data), { status: 200, headers });

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers }
    );
  }
}
