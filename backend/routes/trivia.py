from fastapi import APIRouter, HTTPException, Depends
from typing import List
from datetime import date
from uuid import UUID
from supabase import Client

from models.trivia import DailyTrivia, DailyTriviaCreate
from services.supabase_client import get_db

router = APIRouter(prefix="/api/trivia", tags=["trivia"])

@router.get("/today", response_model=DailyTrivia)
async def get_today_trivia(db: Client = Depends(get_db)):
    """Get today's featured trivia."""
    today = date.today().isoformat()
    
    response = db.table("daily_trivia").select("*").eq("featured_date", today).single().execute()
    
    if not response.data:
        # If no trivia for today, get the latest one
        response = db.table("daily_trivia").select("*").order("created_at", desc=True).limit(1).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="No trivia available")
        
        return response.data[0]
    
    return response.data

@router.get("/", response_model=List[DailyTrivia])
async def get_all_trivia(limit: int = 20, offset: int = 0, db: Client = Depends(get_db)):
    """Get all trivia entries with pagination."""
    response = db.table("daily_trivia").select("*").order("created_at", desc=True).range(offset, offset + limit - 1).execute()
    
    return response.data or []

@router.get("/{trivia_id}", response_model=DailyTrivia)
async def get_trivia(trivia_id: UUID, db: Client = Depends(get_db)):
    """Get a specific trivia by ID."""
    response = db.table("daily_trivia").select("*").eq("id", str(trivia_id)).single().execute()
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Trivia not found")
    
    return response.data

@router.post("/", response_model=DailyTrivia)
async def create_trivia(trivia: DailyTriviaCreate, db: Client = Depends(get_db)):
    """Create a new trivia entry."""
    response = db.table("daily_trivia").insert(trivia.model_dump()).execute()
    
    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create trivia")
    
    return response.data[0]
