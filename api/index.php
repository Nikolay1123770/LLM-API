<?php
// https://bothost.vercel.app/api — работает прямо сейчас
header('Content-Type: application/json');
$GROQ_KEY = "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";

$input = json_decode(file_get_contents('php://input'), true);
$model_map = [
    "llama-3.1-405b" => "llama-3.1-405b-reasoning",
    "llama-3.1-70b" => "llama-3.1-70b-versatile",
    "mixtral" => "mixtral-8x7b-32768",
    "gemma2" => "gemma2-9b-it"
];
$model = $model_map[$input['model'] ?? 'llama-3.1-70b'] ?? "llama-3.1-70b-versatile";

$payload = json_encode([
    "messages" => $input['messages'] ?? [],
    "model" => $model,
    "temperature" => $input['temperature'] ?? 0.7,
    "max_tokens" => $input['max_tokens'] ?? 8192,
    "stream" => $input['stream'] ?? false
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
echo curl_exec($ch);
