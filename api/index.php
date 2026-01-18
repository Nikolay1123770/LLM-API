<?php
// Файл: api/index.php

// 1. РАЗРЕШАЕМ ДОСТУП ВСЕМ (CORS) — это исправит твою ошибку
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Обработка предварительного запроса браузера (Preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Твой ключ Groq
$GROQ_KEY = "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";

// Получаем данные
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

// Если данных нет (просто открыли ссылку в браузере)
if (!$input) {
    echo json_encode(["status" => "BotHost API is running", "time" => date("H:i:s")]);
    exit;
}

// Маппинг моделей
$model_map = [
    "gpt-4o" => "llama-3.1-70b-versatile", // Эмуляция GPT-4o через Llama
    "llama-3.1-405b" => "llama-3.1-405b-reasoning",
    "llama-3.1-70b" => "llama-3.1-70b-versatile",
    "mixtral" => "mixtral-8x7b-32768"
];

$user_model = $input['model'] ?? 'llama-3.1-70b';
$real_model = $model_map[$user_model] ?? "llama-3.1-70b-versatile";

// Формируем запрос к Groq
$payload = json_encode([
    "messages" => $input['messages'] ?? [],
    "model" => $real_model,
    "temperature" => 0.7,
    "max_tokens" => 4096,
    "stream" => false // Пока выключим стрим для надежности
]);

$ch = curl_init("https://api.groq.com/openai/v1/chat/completions");
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer $GROQ_KEY",
        "Content-Type: application/json"
    ],
    CURLOPT_RETURNTRANSFER => true
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    echo json_encode(["error" => "Curl error: " . curl_error($ch)]);
} else {
    // Отдаем ответ как есть
    echo $response;
}
curl_close($ch);
?>
