from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID

MasteryLevel = Literal["low", "medium", "critical"]
Category = Literal["physical", "human", "regional"]

class MistakeBase(BaseModel):
    """Base mistake schema."""
    title: str = Field(..., min_length=1, max_length=200)
    question: Optional[str] = None
    category: Category = "physical"
    mastery_level: MasteryLevel = "low"
    image_url: Optional[str] = None

class MistakeCreate(MistakeBase):
    """Schema for creating a mistake entry."""
    user_id: UUID

class MistakeUpdate(BaseModel):
    """Schema for updating a mistake entry."""
    mastery_level: Optional[MasteryLevel] = None
    question: Optional[str] = None

class Mistake(MistakeBase):
    """Complete mistake schema."""
    id: UUID
    user_id: UUID
    added_at: datetime
    
    class Config:
        from_attributes = True
