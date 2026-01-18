// api/index.js
// Используем стандартный Node.js синтаксис (CommonJS)

module.exports = async (req, res) => {
    // 1. CORS заголовки (чтобы сайт работал)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Если это предварительный запрос браузера
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const GROQ_KEY = "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";

        // Получаем данные
        const body = req.body || {};
        const messages = body.messages;

        if (!messages) {
            return res.status(200).json({ status: "BotHost API is Running (Node.js)" });
        }

        // Карта моделей
        const modelMap = {
            "gpt-4o": "llama-3.1-70b-versatile",
            "llama-3.1-405b": "llama-3.1-405b-reasoning",
            "llama-3.1-70b": "llama-3.1-70b-versatile",
            "mixtral": "mixtral-8x7b-32768"
        };

        const targetModel = modelMap[body.model] || "llama-3.1-70b-versatile";

        // Запрос к Groq
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: messages,
                model: targetModel,
                temperature: body.temperature || 0.7,
                max_tokens: 4096
            })
        });

        const data = await response.json();

        // Если Groq вернул ошибку
        if (data.error) {
            return res.status(400).json({ error: data.error });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
