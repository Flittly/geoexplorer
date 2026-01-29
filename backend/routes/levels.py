from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
from uuid import UUID
from supabase import Client

from models.level import Level, LevelCreate, UserLevelProgress, UserLevelProgressUpdate
from services.supabase_client import get_db

router = APIRouter(prefix="/api/levels", tags=["levels"])

@router.get("/", response_model=List[Level])
async def get_all_levels(db: Client = Depends(get_db)):
    """Get all levels ordered by index."""
    response = db.table("levels").select("*").order("order_index").execute()
    
    return response.data or []

@router.get("/{level_id}", response_model=Level)
async def get_level(level_id: UUID, db: Client = Depends(get_db)):
    """Get a specific level by ID."""
    response = db.table("levels").select("*").eq("id", str(level_id)).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Level not found")
    
    return response.data

@router.post("/", response_model=Level)
async def create_level(level: LevelCreate, db: Client = Depends(get_db)):
    """Create a new level."""
    response = db.table("levels").insert(level.model_dump()).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create level")
    
    return response.data[0]

@router.get("/user/{user_id}/progress", response_model=List[UserLevelProgress])
async def get_user_level_progress(user_id: UUID, db: Client = Depends(get_db)):
    """Get all level progress for a user."""
    # Get all levels
    levels_response = db.table("levels").select("*").order("order_index").execute()
    levels = {l["id"]: l for l in (levels_response.data or [])}
    
    # Get user's progress records
    progress_response = db.table("user_level_progress").select("*").eq("user_id", str(user_id)).execute()
    progress_map = {p["level_id"]: p for p in (progress_response.data or [])}
    
    # Combine levels with progress
    result = []
    for level_id, level in levels.items():
        if level_id in progress_map:
            progress = progress_map[level_id]
            progress["level_name"] = level["name"]
            progress["level_order"] = level["order_index"]
            result.append(progress)
        else:
            # Create default locked progress
            result.append({
                "id": None,
                "user_id": str(user_id),
                "level_id": level_id,
                "status": "locked",
                "score": 0,
                "stars": 0,
                "completion_percentage": 0,
                "completed_at": None,
                "level_name": level["name"],
                "level_order": level["order_index"]
            })
    
    # Sort by level order
    result.sort(key=lambda x: x.get("level_order", 0))
    
    return result

@router.put("/user/{user_id}/progress/{level_id}", response_model=UserLevelProgress)
async def update_user_level_progress(
    user_id: UUID, 
    level_id: UUID, 
    progress: UserLevelProgressUpdate,
    db: Client = Depends(get_db)
):
    """Update user's progress for a specific level."""
    update_data = progress.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    # Check if progress record exists
    existing = db.table("user_level_progress").select("*").eq("user_id", str(user_id)).eq("level_id", str(level_id)).execute()
    
    if existing.data:
        # Update existing record
        if update_data.get("status") == "completed" and not existing.data[0].get("completed_at"):
            update_data["completed_at"] = datetime.now().isoformat()
        
        response = db.table("user_level_progress").update(update_data).eq("user_id", str(user_id)).eq("level_id", str(level_id)).execute()
    else:
        # Create new progress record
        new_progress = {
            "user_id": str(user_id),
            "level_id": str(level_id),
            **update_data
        }
        
        if new_progress.get("status") == "completed":
            new_progress["completed_at"] = datetime.now().isoformat()
        
        response = db.table("user_level_progress").insert(new_progress).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to update progress")
    
    # Update user's total stars if stars changed
    if "stars" in update_data:
        stars_response = db.table("user_level_progress").select("stars").eq("user_id", str(user_id)).execute()
        total_stars = sum(p["stars"] for p in (stars_response.data or []))
        db.table("users").update({"total_stars": total_stars}).eq("id", str(user_id)).execute()
    
    return response.data[0]
