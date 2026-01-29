from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    """Base user schema with common fields."""
    name: str = Field(..., min_length=1, max_length=100)
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    """Schema for creating a new user."""
    pass

class UserUpdate(BaseModel):
    """Schema for updating user information."""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    avatar_url: Optional[str] = None
    level: Optional[str] = None
    total_stars: Optional[int] = None

class User(UserBase):
    """Complete user schema with all fields."""
    id: UUID
    level: str = "初学者"
    total_stars: int = 0
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserProgress(BaseModel):
    """User progress summary."""
    user_id: UUID
    total_stars: int
    level: str
    completed_levels: int
    current_level_id: Optional[UUID] = None
    
    class Config:
        from_attributes = True
