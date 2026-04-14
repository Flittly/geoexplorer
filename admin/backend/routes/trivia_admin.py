from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional, List
from datetime import datetime
from supabase import Client

from backend.services.supabase_client import get_db
from admin.backend.routes.auth_admin import get_current_admin, log_admin_action
from admin.backend.models.admin_models import TriviaCreate, TriviaUpdate

router = APIRouter(prefix="/api/admin/trivia", tags=["Admin Trivia"])


@router.get("")
async def list_trivia(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    keyword: Optional[str] = None,
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db),
):
    """获取每日百科列表"""
    try:
        # 构建查询
        query = db.table("trivia").select("*", count="exact")

        if keyword:
            # 搜索问题或解释
            query = query.or_(f"question.ilike.%{keyword}%,explanation.ilike.%{keyword}%")

        # 排序
        query = query.order("created_at", desc=True)

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


@router.get("/{trivia_id}")
async def get_trivia(
    trivia_id: str, admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """获取单个百科详情"""
    try:
        result = db.table("trivia").select("*").eq("id", trivia_id).single().execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="题目不存在"
            )
            
        return result.data
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"获取详情失败: {str(e)}"
        )


@router.post("")
async def create_trivia(
    trivia: TriviaCreate, admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """创建每日百科"""
    try:
        data = trivia.dict()
        data["created_at"] = datetime.utcnow().isoformat()
        
        result = db.table("trivia").insert(data).execute()
        
        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="创建失败"
            )
            
        # 记录日志
        log_admin_action(
            admin["id"], "create_trivia", "trivia", result.data[0]["id"], data
        )
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"创建失败: {str(e)}"
        )


@router.put("/{trivia_id}")
async def update_trivia(
    trivia_id: str,
    trivia: TriviaUpdate,
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db)
):
    """更新每日百科"""
    try:
        # 检查是否存在
        check = db.table("trivia").select("id").eq("id", trivia_id).single().execute()
        
        if not check.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="题目不存在"
            )
            
        data = trivia.dict(exclude_unset=True)
        if not data:
            return check.data
            
        result = db.table("trivia").update(data).eq("id", trivia_id).execute()
        
        # 记录日志
        log_admin_action(
            admin["id"], "update_trivia", "trivia", trivia_id, data
        )
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"更新失败: {str(e)}"
        )


@router.delete("/{trivia_id}")
async def delete_trivia(
    trivia_id: str, admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """删除每日百科"""
    try:
        # 检查是否存在
        check = db.table("trivia").select("id").eq("id", trivia_id).single().execute()
        
        if not check.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="题目不存在"
            )
            
        db.table("trivia").delete().eq("id", trivia_id).execute()
        
        # 记录日志
        log_admin_action(
            admin["id"], "delete_trivia", "trivia", trivia_id, {}
        )
        
        return {"message": "删除成功"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"删除失败: {str(e)}"
        )
