from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from uuid import UUID
from supabase import Client

from models.ar_landform import ARLandform, ARLandformCreate
from services.supabase_client import get_db

router = APIRouter(prefix="/api/ar-landforms", tags=["ar-landforms"])

@router.get("/", response_model=List[ARLandform])
async def get_ar_landforms(
    landform_type: Optional[str] = Query(None, description="Filter by type: basin, peak, valley, cliff"),
    db: Client = Depends(get_db)
):
    """Get all AR landforms with optional type filter."""
    query = db.table("ar_landforms").select("*")
    
    if landform_type:
        query = query.eq("type", landform_type)
    
    response = query.order("name").execute()
    
    return response.data or []

@router.get("/{landform_id}", response_model=ARLandform)
async def get_ar_landform(landform_id: UUID, db: Client = Depends(get_db)):
    """Get a specific AR landform by ID."""
    response = db.table("ar_landforms").select("*").eq("id", str(landform_id)).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="AR landform not found")
    
    return response.data

@router.post("/", response_model=ARLandform)
async def create_ar_landform(landform: ARLandformCreate, db: Client = Depends(get_db)):
    """Create a new AR landform."""
    response = db.table("ar_landforms").insert(landform.model_dump()).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create AR landform")
    
    return response.data[0]
