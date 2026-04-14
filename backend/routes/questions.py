from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel
from supabase import Client

from services.supabase_client import get_db

router = APIRouter(prefix="/api/questions", tags=["questions"])


class Question(BaseModel):
    id: str
    level_id: str
    question: str
    options: List[str]
    correct_answer: int
    explanation: str
    order_index: int


class QuestionCreate(BaseModel):
    level_id: str
    question: str
    options: List[str]
    correct_answer: int
    explanation: str
    order_index: int = 0


class QuizResult(BaseModel):
    question_id: str
    user_id: str
    selected_answer: int
    is_correct: bool


@router.get("/level/{level_id}", response_model=List[Question])
async def get_questions_by_level(level_id: UUID, db: Client = Depends(get_db)):
    """Get all questions for a specific level."""
    response = (
        db.table("questions")
        .select("*")
        .eq("level_id", str(level_id))
        .order("order_index")
        .execute()
    )

    return response.data or []


@router.get("/{question_id}", response_model=Question)
async def get_question(question_id: UUID, db: Client = Depends(get_db)):
    """Get a specific question by ID."""
    response = (
        db.table("questions").select("*").eq("id", str(question_id)).single().execute()
    )

    if not response.data:
        raise HTTPException(status_code=404, detail="Question not found")

    return response.data


@router.post("/", response_model=Question)
async def create_question(question: QuestionCreate, db: Client = Depends(get_db)):
    """Create a new question."""
    response = db.table("questions").insert(question.model_dump()).execute()

    if not response.data:
        raise HTTPException(status_code=400, detail="Failed to create question")

    return response.data[0]


@router.post("/submit")
async def submit_answer(result: QuizResult, db: Client = Depends(get_db)):
    """Submit an answer for a question."""
    # Get the question to check if answer is correct
    question_response = (
        db.table("questions")
        .select("*")
        .eq("id", result.question_id)
        .single()
        .execute()
    )

    if not question_response.data:
        raise HTTPException(status_code=404, detail="Question not found")

    question = question_response.data
    is_correct = result.selected_answer == question["correct_answer"]

    # Save the result
    save_data = {
        "question_id": result.question_id,
        "user_id": result.user_id,
        "selected_answer": result.selected_answer,
        "is_correct": is_correct,
    }

    db.table("user_answers").upsert(save_data).execute()

    return {
        "is_correct": is_correct,
        "correct_answer": question["correct_answer"],
        "explanation": question["explanation"],
    }


@router.get("/user/{user_id}/results")
async def get_user_results(user_id: UUID, db: Client = Depends(get_db)):
    """Get all quiz results for a user."""
    response = (
        db.table("user_answers").select("*").eq("user_id", str(user_id)).execute()
    )

    return response.data or []
