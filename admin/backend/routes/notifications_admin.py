from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from datetime import datetime
from supabase import Client

from backend.services.supabase_client import get_db
from admin.backend.routes.auth_admin import get_current_admin, log_admin_action
from admin.backend.models.admin_models import (
    NotificationCreate,
    NotificationListResponse,
)

router = APIRouter(prefix="/api/admin/notifications", tags=["Admin Notifications"])


@router.get("")
async def list_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    user_id: Optional[str] = None,
    type: Optional[str] = None,
    is_read: Optional[bool] = None,
    admin: dict = Depends(get_current_admin),
    db: Client = Depends(get_db),
):
    """获取通知列表"""
    # 构建查询
    query = db.table("notifications").select("*", count="exact")

    if user_id:
        query = query.eq("user_id", user_id)
    if type:
        query = query.eq("type", type)
    if is_read is not None:
        query = query.eq("is_read", is_read)

    # 分页
    start = (page - 1) * page_size
    query = query.order("created_at", desc=True).range(start, start + page_size - 1)

    result = query.execute()

    return {
        "items": result.data,
        "total": result.count,
        "page": page,
        "page_size": page_size,
        "total_pages": (result.count + page_size - 1) // page_size if result.count else 0,
    }


@router.post("")
async def create_notification(
    notification: NotificationCreate, admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """创建通知"""
    # 如果指定了用户名，先查找用户ID
    user_id = notification.user_id

    # 创建通知
    data = {
        "user_id": user_id,
        "type": notification.type,
        "title": notification.title,
        "message": notification.message,
        "data": notification.data or {},
        "created_at": datetime.utcnow().isoformat(),
        "is_read": False,
    }

    result = db.table("notifications").insert(data).execute()

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="创建通知失败"
        )

    # 记录日志
    log_admin_action(
        admin["id"], "create_notification", "notifications", result.data[0]["id"], data
    )

    return result.data[0]


@router.get("/{notification_id}")
async def get_notification(
    notification_id: str, admin: dict = Depends(get_current_admin)
):
    """获取单个通知详情"""
    try:
        result = (
            supabase.table("user_notifications")
            .select("*, users(name)")
            .eq("id", notification_id)
            .single()
            .execute()
        )

        if not result.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="通知不存在"
            )

        n = result.data
        return {
            "id": n["id"],
            "user_id": n.get("user_id"),
            "user_name": n.get("users", {}).get("name") if n.get("users") else None,
            "title": n["title"],
            "content": n["content"],
            "type": n["type"],
            "is_read": n["is_read"],
            "is_broadcast": n["is_broadcast"],
            "created_at": n["created_at"],
            "read_at": n.get("read_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"获取通知详情失败: {str(e)}",
        )


@router.post("/broadcast")
async def broadcast_notification(
    notification: NotificationCreate, admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """广播通知给所有用户"""
    try:
        # 获取所有用户
        # 注意：这里可能需要分批处理如果用户量很大
        users_result = db.table("users").select("id").execute()
        if not users_result.data:
            return {"count": 0}

        notifications = []
        now = datetime.utcnow().isoformat()
        
        for user in users_result.data:
            notifications.append({
                "user_id": user["id"],
                "type": notification.type,
                "title": notification.title,
                "message": notification.message,
                "data": notification.data or {},
                "created_at": now,
                "is_read": False,
            })
            
        # 批量插入
        # Supabase 可能限制单次插入数量，这里假设数量不大
        # 实际生产中应该分批插入
        if notifications:
            result = db.table("notifications").insert(notifications).execute()
            count = len(result.data)
        else:
            count = 0

        # 记录日志
        log_admin_action(
            admin["id"], 
            "broadcast_notification", 
            "notifications", 
            None, 
            {"title": notification.title, "count": count}
        )

        return {"count": count}
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"广播通知失败: {str(e)}"
        )


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: str, admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """删除通知"""
    # 检查通知是否存在
    check = (
        db.table("notifications")
        .select("id")
        .eq("id", notification_id)
        .single()
        .execute()
    )

    if not check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="通知不存在"
        )

    # 删除
    db.table("notifications").delete().eq(
        "id", notification_id
    ).execute()

    # 记录日志
    log_admin_action(
        admin["id"], "delete_notification", "notifications", notification_id, {}
    )

    return {"message": "通知已删除"}
