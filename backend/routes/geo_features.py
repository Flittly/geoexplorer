from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from uuid import UUID
from supabase import Client

from models.geo_feature import GeographicFeature, GeographicFeatureCreate
from services.supabase_client import get_db

router = APIRouter(prefix="/api/geo-features", tags=["geographic-features"])

@router.get("/", response_model=List[GeographicFeature])
async def get_geo_features(
    feature_type: Optional[str] = Query(None, description="Filter by type: volcano, mountain, desert, etc."),
    region: Optional[str] = Query(None, description="Filter by region"),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    db: Client = Depends(get_db)
):
    """Get geographic features with optional filters."""
    query = db.table("geographic_features").select("*")
    
    if feature_type:
        query = query.eq("feature_type", feature_type)
    
    if region:
        query = query.ilike("region", f"%{region}%")
    
    response = query.order("name").range(offset, offset + limit - 1).execute()
    
    return response.data or []

@router.get("/{feature_id}", response_model=GeographicFeature)
async def get_geo_feature(feature_id: UUID, db: Client = Depends(get_db)):
    """Get a specific geographic feature by ID."""
    response = db.table("geographic_features").select("*").eq("id", str(feature_id)).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Geographic feature not found")
    
    return response.data

@router.post("/", response_model=GeographicFeature)
async def create_geo_feature(feature: GeographicFeatureCreate, db: Client = Depends(get_db)):
    """Create a new geographic feature."""
    response = db.table("geographic_features").insert(feature.model_dump()).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create geographic feature")
    
    return response.data[0]

@router.get("/search/{query}", response_model=List[GeographicFeature])
async def search_geo_features(query: str, limit: int = 10, db: Client = Depends(get_db)):
    """Search geographic features by name or description."""
    response = db.table("geographic_features").select("*").or_(f"name.ilike.%{query}%,description.ilike.%{query}%").limit(limit).execute()
    
    return response.data or []
