import requests
from fastapi import HTTPException

class DeepSeekService:
    def __init__(self, api_key, api_url):
        self.api_key = api_key
        self.api_url = api_url

    def _call_deepseek(self, prompt: str) -> str:
        if not self.api_key:
            raise HTTPException(status_code=500, detail="DeepSeek API Key is missing")

        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        payload = {
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7
        }

        try:
            response = requests.post(self.api_url, headers=headers, json=payload)
            response.raise_for_status()
            response_json = response.json()
            choices = response_json.get("choices", [])
            if not choices or "message" not in choices[0] or "content" not in choices[0]["message"]:
                raise HTTPException(status_code=500, detail="Invalid response from DeepSeek API")
            return choices[0]["message"]["content"].strip()
        except requests.RequestException as e:
            raise HTTPException(status_code=500, detail=f"DeepSeek API error: {str(e)}")

    async def correct_word(self, word: str, languages: list) -> str: 
        prompt_word = f"""You are a German language tutor.
            Correct the following German word and provide:
            1. Correct the German word with article, if available
            2. Provide the synonyms, if available
            3. Translation the word in in {', '.join(languages)}
            4. Provide 3 example sentences for the German word '{word}' in german bold font(english italic font) and do not use any other extra explantion.
            Word: '{word}'.please do not ask further question to the user like "Let me know if you'd like further refinements!" """
        return self._call_deepseek(prompt_word)

    async def correct_sentence(self, sentence: str, languages: list) -> str:
        prompt = f"""You are a German language tutor.
            Correct the following German sentence and provide:
            1. The corrected German sentence
            2. Translate the German sentence in {', '.join(languages)}
            3. A brief grammar explanation in structure only.
            Sentence: '{sentence}'."""
        return self._call_deepseek(prompt)