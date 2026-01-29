from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from uuid import UUID

class GeographicFeatureBase(BaseModel):
    """Base geographic feature schema."""
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    feature_type: Optional[str] = None  # volcano, mountain, desert, etc.
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    region: Optional[str] = None
    image_url: Optional[str] = None
    stats: Optional[Dict[str, Any]] = None

class GeographicFeatureCreate(GeographicFeatureBase):
    """Schema for creating a geographic feature."""
    pass

class GeographicFeature(GeographicFeatureBase):
    """Complete geographic feature schema."""
    id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True
