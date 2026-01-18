import os
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

# Загружаем ключ из .env файла
load_dotenv()
API_KEY = os.getenv("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")

if not API_KEY:
    raise ValueError("API ключ не найден! Проверь файл .env")

# Настройка клиента Groq
client = Groq(api_key=API_KEY)

app = FastAPI(title="BotHost LLM")

# Модель данных для запроса
class ChatRequest(BaseModel):
    message: str

# 1. Эндпоинт API (сюда стучится сайт)
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        # Отправляем запрос в Groq (используем быструю модель Llama 3)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "Ты полезный ассистент на сайте BotHost.ru. Отвечай кратко и по делу. Говори по-русски."
                },
                {
                    "role": "user",
                    "content": request.message,
                }
            ],
            model="llama3-8b-8192", # Очень быстрая и дешевая модель
            temperature=0.7,
        )
        return {"response": chat_completion.choices[0].message.content}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 2. Раздача статики (Фронтенд)
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def read_root():
    return FileResponse('static/index.html')

# Запуск: uvicorn main:app --reload
