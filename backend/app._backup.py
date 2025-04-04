import os
import requests
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, validator
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import uvicorn

# Load environment variables
load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    allow_credentials=True
)

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URI)
db = client.german_tutor
users_collection = db.users
history_collection = db.history
words_collection = db.words

# DeepSeek API Config
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"

# Request Models
class UserBase(BaseModel):
    email: EmailStr

class WordRequest(UserBase):
    word: str
    languages: List[str]

    @validator("languages")
    def validate_languages(cls, v):
        valid_languages = {"en", "es", "bn"}
        if not v or any(lang not in valid_languages for lang in v):
            raise ValueError("Languages must be a non-empty list of 'en', 'es', or 'bn'")
        return v

class SentenceRequest(UserBase):
    sentence: str
    languages: List[str]

    @validator("languages")
    def validate_languages(cls, v):
        valid_languages = {"en", "es", "bn"}
        if not v or any(lang not in valid_languages for lang in v):
            raise ValueError("Languages must be a non-empty list of 'en', 'es', or 'bn'")
        return v

# Helper Function: Call DeepSeek API
def call_deepseek(prompt: str) -> str:
    if not DEEPSEEK_API_KEY:
        raise HTTPException(status_code=500, detail="DeepSeek API Key is missing")

    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "deepseek-chat",
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.7
    }

    try:
        response = requests.post(DEEPSEEK_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        response_json = response.json()

        choices = response_json.get("choices", [])
        if not choices or "message" not in choices[0] or "content" not in choices[0]["message"]:
            raise HTTPException(status_code=500, detail="Invalid response from DeepSeek API")
        return choices[0]["message"]["content"].strip()

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"DeepSeek API error: {str(e)}")

# Endpoint: Correct Word
@app.post("/correct-word")
async def correct_word(request: WordRequest):
    try:
        # Correct the German word using DeepSeek
        prompt_word = f"""You are a German language tutor.
            Correct the following German word and provide:
            1. Correct the German word with article, if available
            2. Provide the synonyms, if available
            3. Translation the word in ({request.languages}) 
            4. Provide 3 example sentences for the German word '{request.word}' only in german and do not use any other extra explantion.
            Word: '{request.word}'.please do not ask further question to the user like "Let me know if you'd like further refinements!" """
        corrected_word = call_deepseek(prompt_word)
        # Save to history
        # history_entry = {
        #     "email": request.email,
        #     "type": "word",
        #     "original": request.word,
        #     "corrected": corrected_word,
        #     "translations": translations,
        #     "article": article,
        #     "synonyms": synonyms,
        #     "examples": examples,
        #     "timestamp": datetime.utcnow()
        # }
        #await history_collection.insert_one(history_entry)
       
        return corrected_word
        # return {
        #     "word": corrected_word,
        #     "article": article,
        #     "synonyms": synonyms,
        #     #"translations": translations,
        #     "examples": examples
        # }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing word: {str(e)}")

# Endpoint: Correct Sentence
@app.post("/correct-sentence")
async def correct_sentence(request: SentenceRequest):
    try:
        # Correct the German sentence using DeepSeek
        
        languages={"English","Bangla","Spanish"} 
        prompt_sentence = f"""You are a German language tutor.
        Correct the following German sentence and provide:
        1. The corrected German sentence
        2. The Translate the German sentence in {request.languages}
        4. A brief grammar explanation in structure only.do not need to explain incorrectly uses.
        Sentence:'{request.sentence}'.please do not ask to user for continuous communication."""
        corrected_sentence = call_deepseek(prompt_sentence)

        return corrected_sentence
 
        # Save to history
        # history_entry = {
        #     "email": request.email,
        #     "type": "sentence",
        #     "original": request.sentence,
        #     "corrected": corrected_sentence,
        #     "translations": translations,
        #     "grammar_explanation": grammar_explanation,
        #     "timestamp": datetime.utcnow()
        # }
        # await history_collection.insert_one(history_entry)

        # return {
        #     "corrected_sentence": corrected_sentence,
        #     "translations": translations,
        #     "grammar_explanation": grammar_explanation
        # }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing sentence: {str(e)}")

# Endpoint: Get User History
@app.get("/history/{email}")
async def get_user_history(email: str):
    history = await history_collection.find({"email": email}).to_list(length=100)
    if not history:
        raise HTTPException(status_code=404, detail="No history found for this user")
    return history

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)