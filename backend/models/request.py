from pydantic import BaseModel, validator
from typing import List
from .user import UserBase

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