from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from config.settings import Settings
from services.deepseek_service import DeepSeekService
from models.request import WordRequest, SentenceRequest

app = FastAPI()

# Configure CORS
settings = Settings()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://german-translator-frontend.onrender.com"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=True
)

# Services
deepseek_service = DeepSeekService(settings.deepseek_api_key,settings.deepseek_api_url)

@app.post("/correct-word")
async def correct_word(request: WordRequest):
    return await deepseek_service.correct_word(request.word,request.languages)

@app.post("/correct-sentence")
async def correct_sentence(request: SentenceRequest):
    return await deepseek_service.correct_sentence(request.sentence, request.languages)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=10000, reload=True)