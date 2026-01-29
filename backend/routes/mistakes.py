from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from uuid import UUID
from supabase import Client

from models.mistake import Mistake, MistakeCreate, MistakeUpdate
from services.supabase_client import get_db

router = APIRouter(prefix="/api/mistakes", tags=["mistakes"])

@router.get("/", response_model=List[Mistake])
async def get_mistakes(
    user_id: Optional[UUID] = Query(None, description="Filter by user ID"),
    category: Optional[str] = Query(None, description="Filter by category: physical, human, regional"),
    mastery_level: Optional[str] = Query(None, description="Filter by mastery: low, medium, critical"),
    limit: int = Query(50, le=100),
    offset: int = Query(0, ge=0),
    db: Client = Depends(get_db)
):
    """Get mistakes with optional filters."""
    query = db.table("mistakes").select("*")
    
    if user_id:
        query = query.eq("user_id", str(user_id))
    
    if category:
        query = query.eq("category", category)
    
    if mastery_level:
        query = query.eq("mastery_level", mastery_level)
    
    response = query.order("added_at", desc=True).range(offset, offset + limit - 1).execute()
    
    return response.data or []

@router.get("/{mistake_id}", response_model=Mistake)
async def get_mistake(mistake_id: UUID, db: Client = Depends(get_db)):
    """Get a specific mistake by ID."""
    response = db.table("mistakes").select("*").eq("id", str(mistake_id)).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Mistake not found")
    
    return response.data

@router.post("/", response_model=Mistake)
async def create_mistake(mistake: MistakeCreate, db: Client = Depends(get_db)):
    """Add a new mistake entry."""
    data = mistake.model_dump()
    data["user_id"] = str(data["user_id"])
    
    response = db.table("mistakes").insert(data).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create mistake")
    
    return response.data[0]

@router.put("/{mistake_id}", response_model=Mistake)
async def update_mistake(mistake_id: UUID, mistake: MistakeUpdate, db: Client = Depends(get_db)):
    """Update a mistake entry."""
    update_data = mistake.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    response = db.table("mistakes").update(update_data).eq("id", str(mistake_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Mistake not found")
    
    return response.data[0]

@router.delete("/{mistake_id}")
async def delete_mistake(mistake_id: UUID, db: Client = Depends(get_db)):
    """Delete a mistake entry."""
    response = db.table("mistakes").delete().eq("id", str(mistake_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Mistake not found")
    
    return {"message": "Mistake deleted successfully"}
