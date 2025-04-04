from datetime import datetime
from pydantic import BaseModel

class HistoryEntry(BaseModel):
    email: str
    type: str
    original: str
    corrected: str
    timestamp: datetime