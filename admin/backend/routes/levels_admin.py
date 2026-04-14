from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional, List
from datetime import datetime
from supabase import Client

from backend.services.supabase_client import get_db
from admin.backend.routes.auth_admin import get_current_admin, log_admin_action
from admin.backend.models.admin_models import (
    LevelCreate,
    LevelUpdate,
    LevelDetailResponse,
)

router = APIRouter(prefix="/api/admin/levels", tags=["Admin Levels"])


@router.get("")
async def list_levels(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db),
):
    """获取关卡列表"""
    try:
        # 查询关卡
        query = db.table("levels").select("*", count="exact").order("order_index")

        # 分页
        start = (page - 1) * page_size
        query = query.range(start, start + page_size - 1)

        result = query.execute()

        return {
            "items": result.data,
            "total": result.count,
            "page": page,
            "page_size": page_size,
            "total_pages": (result.count + page_size - 1) // page_size if result.count else 0,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"获取列表失败: {str(e)}"
        )


@router.get("/{level_id}", response_model=LevelDetailResponse)
async def get_level(
    level_id: str, admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """获取关卡详情"""
    try:
        result = db.table("levels").select("*").eq("id", level_id).single().execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="关卡不存在"
            )
            
        level = result.data
        
        # 统计题目数量
        # 这里假设题目在 trivia 表中通过 level_id 关联
        # 实际情况可能有多个表
        questions_count = 0
        try:
            trivia_count = db.table("trivia").select("id", count="exact").eq("level_id", level_id).execute()
            questions_count += trivia_count.count or 0
        except:
            pass
            
        return {
            **level,
            "questions_count": questions_count
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"获取详情失败: {str(e)}"
        )


@router.post("")
async def create_level(
    level: LevelCreate, admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """创建关卡"""
    try:
        data = level.dict()
        
        # 检查顺序是否冲突
        check = db.table("levels").select("id").eq("order_index", level.order_index).execute()
        if check.data:
            # 如果冲突，将后续关卡顺序顺延
            # 这比较复杂，通常建议前端先获取最大顺序号
            pass
            
        result = db.table("levels").insert(data).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="创建失败"
            )
            
        # 记录日志
        log_admin_action(
            admin["id"], "create_level", "levels", result.data[0]["id"], data
        )
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"创建失败: {str(e)}"
        )


@router.put("/{level_id}")
async def update_level(
    level_id: str,
    level: LevelUpdate,
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db)
):
    """更新关卡"""
    try:
        # 检查是否存在
        check = db.table("levels").select("id").eq("id", level_id).single().execute()
        
        if not check.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="关卡不存在"
            )
            
        data = level.dict(exclude_unset=True)
        if not data:
            return check.data
            
        result = db.table("levels").update(data).eq("id", level_id).execute()
        
        # 记录日志
        log_admin_action(
            admin["id"], "update_level", "levels", level_id, data
        )
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"更新失败: {str(e)}"
        )


@router.delete("/{level_id}")
async def delete_level(
    level_id: str, admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """删除关卡"""
    try:
        # 检查是否存在
        check = db.table("levels").select("id").eq("id", level_id).single().execute()
        
        if not check.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="关卡不存在"
            )
            
        # 检查是否有关联题目
        # 实际生产中可能需要先删除或转移题目，或者使用级联删除
        
        db.table("levels").delete().eq("id", level_id).execute()
        
        # 记录日志
        log_admin_action(
            admin["id"], "delete_level", "levels", level_id, {}
        )
        
        return {"message": "删除成功"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"删除失败: {str(e)}"
        )


@router.post("/reorder")
async def reorder_levels(
    level_ids: List[str],
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db)
):
    """重新排序关卡"""
    try:
        # 批量更新顺序
        # Supabase 没有直接的批量更新API，只能循环更新
        # 实际生产中可能需要优化
        
        for index, level_id in enumerate(level_ids):
            db.table("levels").update({"order_index": index + 1}).eq("id", level_id).execute()
            
        # 记录日志
        log_admin_action(
            admin["id"], "reorder_levels", "levels", None, {"count": len(level_ids)}
        )
        
        return {"message": "排序更新成功"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"排序更新失败: {str(e)}"
        )
