from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from datetime import datetime
from supabase import Client

from backend.services.supabase_client import get_db
from admin.backend.routes.auth_admin import get_current_admin, log_admin_action
from admin.backend.models.admin_models import (
    UserListResponse,
    UserUpdateByAdmin,
    UserProgressUpdate,
)

router = APIRouter(prefix="/api/admin/users", tags=["Admin Users"])


@router.get("")
async def list_users(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    keyword: Optional[str] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db),
):
    """获取用户列表"""
    # 构建查询
    query = db.table("users").select("*", count="exact")

    if keyword:
        # 支持搜索用户名或邮箱
        query = query.or_(f"username.ilike.%{keyword}%,email.ilike.%{keyword}%")

    # 排序
    if sort_order == "desc":
        query = query.order(sort_by, desc=True)
    else:
        query = query.order(sort_by, desc=False)

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


@router.get("/{user_id}")
async def get_user_detail(
    user_id: str, admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """获取用户详情"""
    result = db.table("users").select("*").eq("id", user_id).single().execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在"
        )

    return result.data


@router.put("/{user_id}")
async def update_user(
    user_id: str,
    user_update: UserUpdateByAdmin,
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db)
):
    """更新用户信息"""
    # 检查用户是否存在
    check = (
        db.table("users")
        .select("id")
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在"
        )
    
    # 检查用户名是否重复
    if user_update.username:
        check_username = (
            db.table("users")
            .select("id")
            .eq("username", user_update.username)
            .neq("id", user_id)
            .execute()
        )
        if check_username.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="用户名已存在"
            )

    # 准备更新数据
    update_data = user_update.dict(exclude_unset=True)
    if not update_data:
        return check.data

    # 更新
    try:
        result = db.table("users").update(update_data).eq("id", user_id).execute()
        
        # 记录日志
        log_admin_action(
            admin["id"], "update_user", "users", user_id, update_data
        )
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"更新用户失败: {str(e)}"
        )


@router.post("/{user_id}/status")
async def change_user_status(
    user_id: str,
    is_active: bool,
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db)
):
    """更改用户状态（禁用/启用）"""
    # 检查用户是否存在
    check = (
        db.table("users")
        .select("id")
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="用户不存在"
        )

    # 更新
    try:
        update_data = {"is_active": is_active}
        db.table("users").update(update_data).eq("id", user_id).execute()
        
        # 记录日志
        action = "enable_user" if is_active else "disable_user"
        log_admin_action(
            admin["id"], action, "users", user_id, update_data
        )
        
        return {"message": f"用户已{'启用' if is_active else '禁用'}"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"更新用户状态失败: {str(e)}"
        )


@router.get("/{user_id}/progress")
async def get_user_progress(
    user_id: str,
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db)
):
    """获取用户进度"""
    result = (
        db.table("user_level_progress")
        .select("*, levels(title, difficulty)")
        .eq("user_id", user_id)
        .order("updated_at", desc=True)
        .execute()
    )
    
    return result.data


@router.put("/{user_id}/progress")
async def update_user_progress(
    user_id: str,
    progress: UserProgressUpdate,
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db)
):
    """更新或添加用户进度"""
    # 检查是否存在记录
    check = (
        db.table("user_level_progress")
        .select("id")
        .eq("user_id", user_id)
        .eq("level_id", progress.level_id)
        .single()
        .execute()
    )
    
    data = progress.dict(exclude_unset=True)
    data["user_id"] = user_id
    data["updated_at"] = datetime.utcnow().isoformat()
    
    try:
        if check.data:
            # 更新
            result = (
                db.table("user_level_progress")
                .update(data)
                .eq("id", check.data["id"])
                .execute()
            )
        else:
            # 新增
            data["created_at"] = datetime.utcnow().isoformat()
            result = db.table("user_level_progress").insert(data).execute()
            
        # 记录日志
        log_admin_action(
            admin["id"], 
            "update_user_progress", 
            "user_level_progress", 
            result.data[0]["id"], 
            data
        )
        
        return result.data[0]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"更新用户进度失败: {str(e)}"
        )
