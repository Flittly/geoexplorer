from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional, List, Any
from datetime import datetime
from supabase import Client

from backend.services.supabase_client import get_db
from admin.backend.routes.auth_admin import get_current_admin, log_admin_action
from admin.backend.models.admin_models import (
    QuestionCreate,
    QuestionUpdate,
    QuestionResponse,
    QuestionListResponse,
)

router = APIRouter(prefix="/api/admin/questions", tags=["Admin Questions"])


@router.get("", response_model=QuestionListResponse)
async def list_questions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    level_id: Optional[str] = None,
    type: Optional[str] = None,
    difficulty: Optional[str] = None,
    keyword: Optional[str] = None,
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db),
):
    """获取题目列表"""
    # 构建查询
    # 注意：这里假设有一个统一的 questions 表，或者需要根据 type 查询不同表
    # 实际上 GeoExplorer 可能有 trivia_questions, geo_features 等表
    # 这里为了演示，假设主要查询 trivia 表
    
    # 如果 type 未指定或为 trivia，查询 trivia 表
    table_name = "trivia"
    if type == "geo_feature":
        table_name = "geo_features"
    elif type == "ar_landform":
        table_name = "ar_landforms"
        
    query = db.table(table_name).select("*", count="exact")

    if level_id:
        query = query.eq("level_id", level_id)
    if difficulty:
        query = query.eq("difficulty", difficulty)
    if keyword:
        # 支持搜索题目内容
        if table_name == "trivia":
            query = query.ilike("question", f"%{keyword}%")
        elif table_name == "geo_features":
            query = query.ilike("name", f"%{keyword}%")
        elif table_name == "ar_landforms":
            query = query.ilike("name", f"%{keyword}%")

    # 分页
    start = (page - 1) * page_size
    query = query.range(start, start + page_size - 1)

    try:
        result = query.execute()
        
        # 转换数据格式以适配通用 Question 模型
        items = []
        for item in result.data:
            # 简单映射，实际可能需要更复杂的转换
            question_data = {
                "id": item["id"],
                "type": type or "trivia",
                "content": item.get("question") or item.get("name") or item.get("description", ""),
                "level_id": item.get("level_id"),
                "difficulty": item.get("difficulty", "easy"),
                "options": item.get("options", []),
                "correct_answer": item.get("correct_answer") or "",
                "explanation": item.get("explanation", ""),
                "points": item.get("points", 10),
                "image_url": item.get("image_url"),
                "created_at": item.get("created_at"),
                "updated_at": item.get("updated_at")
            }
            items.append(question_data)

        return {
            "items": items,
            "total": result.count or 0,
            "page": page,
            "page_size": page_size,
            "total_pages": (result.count + page_size - 1) // page_size if result.count else 0,
        }
    except Exception as e:
        print(f"查询题目失败: {e}")
        return {
            "items": [],
            "total": 0,
            "page": page,
            "page_size": page_size,
            "total_pages": 0
        }


@router.get("/{question_id}")
async def get_question(
    question_id: str, 
    type: str = "trivia",
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db)
):
    """获取题目详情"""
    table_name = "trivia"
    if type == "geo_feature":
        table_name = "geo_features"
    elif type == "ar_landform":
        table_name = "ar_landforms"
        
    result = db.table(table_name).select("*").eq("id", question_id).single().execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="题目不存在"
        )
    
    item = result.data
    return {
        "id": item["id"],
        "type": type,
        "content": item.get("question") or item.get("name") or item.get("description", ""),
        "level_id": item.get("level_id"),
        "difficulty": item.get("difficulty", "easy"),
        "options": item.get("options", []),
        "correct_answer": item.get("correct_answer") or "",
        "explanation": item.get("explanation", ""),
        "points": item.get("points", 10),
        "image_url": item.get("image_url"),
        "created_at": item.get("created_at"),
        "updated_at": item.get("updated_at"),
        # 保留原始数据
        "raw_data": item
    }


@router.post("")
async def create_question(
    question: QuestionCreate, 
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db)
):
    """创建题目"""
    table_name = "trivia"
    data = {}
    
    # 根据类型构建不同的数据结构
    if question.type == "trivia":
        table_name = "trivia"
        data = {
            "question": question.content,
            "options": question.options,
            "correct_answer": question.correct_answer,
            "explanation": question.explanation,
            "difficulty": question.difficulty,
            "level_id": question.level_id,
            "points": question.points
        }
    elif question.type == "geo_feature":
        table_name = "geo_features"
        # 假设 geo_features 表结构
        data = {
            "name": question.content,
            "description": question.explanation,
            "coordinates": question.raw_data.get("coordinates") if question.raw_data else None,
            "difficulty": question.difficulty,
            "level_id": question.level_id,
            "points": question.points
        }
    elif question.type == "ar_landform":
        table_name = "ar_landforms"
        # 假设 ar_landforms 表结构
        data = {
            "name": question.content,
            "description": question.explanation,
            "model_url": question.raw_data.get("model_url") if question.raw_data else None,
            "difficulty": question.difficulty,
            "level_id": question.level_id
        }
    
    # 添加通用字段
    if question.image_url:
        data["image_url"] = question.image_url
        
    try:
        result = db.table(table_name).insert(data).execute()
        
        # 记录日志
        log_admin_action(
            admin["id"], "create_question", table_name, result.data[0]["id"], data
        )
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"创建题目失败: {str(e)}"
        )


@router.put("/{question_id}")
async def update_question(
    question_id: str,
    question_update: QuestionUpdate,
    type: str = "trivia",
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db)
):
    """更新题目"""
    table_name = "trivia"
    if type == "geo_feature":
        table_name = "geo_features"
    elif type == "ar_landform":
        table_name = "ar_landforms"
        
    # 检查是否存在
    check = db.table(table_name).select("id").eq("id", question_id).single().execute()
    if not check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="题目不存在"
        )
        
    data = {}
    if question_update.content:
        if table_name == "trivia":
            data["question"] = question_update.content
        else:
            data["name"] = question_update.content
            
    if question_update.options and table_name == "trivia":
        data["options"] = question_update.options
    
    if question_update.correct_answer and table_name == "trivia":
        data["correct_answer"] = question_update.correct_answer
        
    if question_update.explanation:
        if table_name == "trivia":
            data["explanation"] = question_update.explanation
        else:
            data["description"] = question_update.explanation
            
    if question_update.difficulty:
        data["difficulty"] = question_update.difficulty
        
    if question_update.level_id:
        data["level_id"] = question_update.level_id
        
    if question_update.points:
        data["points"] = question_update.points
        
    if question_update.image_url:
        data["image_url"] = question_update.image_url
        
    if question_update.raw_data:
        data.update(question_update.raw_data)
    
    if not data:
        return check.data
        
    try:
        result = db.table(table_name).update(data).eq("id", question_id).execute()
        
        # 记录日志
        log_admin_action(
            admin["id"], "update_question", table_name, question_id, data
        )
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"更新题目失败: {str(e)}"
        )


@router.delete("/{question_id}")
async def delete_question(
    question_id: str, 
    type: str = "trivia",
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db)
):
    """删除题目"""
    table_name = "trivia"
    if type == "geo_feature":
        table_name = "geo_features"
    elif type == "ar_landform":
        table_name = "ar_landforms"
        
    try:
        db.table(table_name).delete().eq("id", question_id).execute()
        
        # 记录日志
        log_admin_action(
            admin["id"], "delete_question", table_name, question_id, {}
        )
        
        return {"message": "题目已删除"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"删除题目失败: {str(e)}"
        )
