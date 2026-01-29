from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, date
from uuid import UUID

class DailyTriviaBase(BaseModel):
    """Base trivia schema."""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    image_url: Optional[str] = None
    location: Optional[str] = None
    region: Optional[str] = None

class DailyTriviaCreate(DailyTriviaBase):
    """Schema for creating daily trivia."""
    featured_date: Optional[date] = None

class DailyTrivia(DailyTriviaBase):
    """Complete daily trivia schema."""
    id: UUID
    featured_date: Optional[date] = None
    created_at: datetime
    
    class Config:
        from_attributes = True
