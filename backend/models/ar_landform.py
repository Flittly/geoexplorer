from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime
from uuid import UUID

LandformType = Literal["basin", "peak", "valley", "cliff"]

class ARLandformBase(BaseModel):
    """Base AR landform schema."""
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=200)
    type: LandformType
    image_url: Optional[str] = None
    elevation: Optional[int] = None

class ARLandformCreate(ARLandformBase):
    """Schema for creating an AR landform."""
    pass

class ARLandform(ARLandformBase):
    """Complete AR landform schema."""
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
