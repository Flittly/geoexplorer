from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class LevelBase(BaseModel):
    """Base level schema."""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    order_index: int = Field(..., ge=1)
    unlock_requirement: int = Field(default=0, ge=0)

class LevelCreate(LevelBase):
    """Schema for creating a new level."""
    pass

class Level(LevelBase):
    """Complete level schema."""
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLevelProgressBase(BaseModel):
    """Base user level progress schema."""
    status: str = Field(default="locked")  # locked, active, completed
    score: int = Field(default=0, ge=0)
    stars: int = Field(default=0, ge=0, le=3)
    completion_percentage: int = Field(default=0, ge=0, le=100)

class UserLevelProgressUpdate(BaseModel):
    """Schema for updating level progress."""
    status: Optional[str] = None
    score: Optional[int] = Field(None, ge=0)
    stars: Optional[int] = Field(None, ge=0, le=3)
    completion_percentage: Optional[int] = Field(None, ge=0, le=100)

class UserLevelProgress(UserLevelProgressBase):
    """Complete user level progress schema."""
    id: UUID
    user_id: UUID
    level_id: UUID
    completed_at: Optional[datetime] = None
    
    # Joined level info
    level_name: Optional[str] = None
    level_order: Optional[int] = None
    
    class Config:
        from_attributes = True
