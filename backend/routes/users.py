from fastapi import APIRouter, HTTPException, Depends
from typing import List
from uuid import UUID
from supabase import Client

from models.user import User, UserCreate, UserUpdate, UserProgress
from services.supabase_client import get_db

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: UUID, db: Client = Depends(get_db)):
    """Get a user by ID."""
    response = db.table("users").select("*").eq("id", str(user_id)).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    return response.data

@router.post("/", response_model=User)
async def create_user(user: UserCreate, db: Client = Depends(get_db)):
    """Create a new user."""
    response = db.table("users").insert(user.model_dump()).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create user")
    
    return response.data[0]

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: UUID, user: UserUpdate, db: Client = Depends(get_db)):
    """Update user information."""
    update_data = user.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    response = db.table("users").update(update_data).eq("id", str(user_id)).execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    return response.data[0]

@router.get("/{user_id}/progress", response_model=UserProgress)
async def get_user_progress(user_id: UUID, db: Client = Depends(get_db)):
    """Get user's overall learning progress."""
    # Get user info
    user_response = db.table("users").select("*").eq("id", str(user_id)).single().execute()
    
    if not user_response.data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get completed levels count
    progress_response = db.table("user_level_progress").select("*").eq("user_id", str(user_id)).eq("status", "completed").execute()
    completed_levels = len(progress_response.data) if progress_response.data else 0
    
    # Get current active level
    active_response = db.table("user_level_progress").select("level_id").eq("user_id", str(user_id)).eq("status", "active").execute()
    current_level_id = active_response.data[0]["level_id"] if active_response.data else None
    
    return {
        "user_id": user_id,
        "total_stars": user_response.data["total_stars"],
        "level": user_response.data["level"],
        "completed_levels": completed_levels,
        "current_level_id": current_level_id
    }
