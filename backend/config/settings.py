import os
from dotenv import load_dotenv

class Settings:
    def __init__(self):
        load_dotenv()
        self.deepseek_api_key = os.getenv("DEEPSEEK_API_KEY")
        self.deepseek_api_url = os.getenv("DEEPSEEK_API_URL")