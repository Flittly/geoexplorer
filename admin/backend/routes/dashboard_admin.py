from fastapi import APIRouter, Depends, Query
from typing import Optional
from datetime import datetime, timedelta
from supabase import Client

from backend.services.supabase_client import get_db
from admin.backend.routes.auth_admin import get_current_admin, log_admin_action

router = APIRouter(prefix="/api/admin/dashboard", tags=["Admin Dashboard"])


@router.get("/stats")
async def get_dashboard_stats(admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)):
    """获取仪表盘统计数据"""
    try:
        # 获取用户总数
        users_result = db.table("users").select("id", count="exact").execute()
        total_users = users_result.count or 0

        # 获取今日新用户
        today = datetime.utcnow().date().isoformat()
        today_users_result = (
            db.table("users")
            .select("id", count="exact")
            .gte("created_at", today)
            .execute()
        )
        today_new_users = today_users_result.count or 0

        # 获取课程总数
        courses_result = db.table("levels").select("id", count="exact").execute()
        total_courses = courses_result.count or 0

        # 获取题目总数
        questions_result = (
            db.table("questions").select("id", count="exact").execute()
        )
        total_questions = questions_result.count or 0

        # 获取每日百科总数
        trivia_result = (
            db.table("daily_trivia").select("id", count="exact").execute()
        )
        total_trivia = trivia_result.count or 0

        # 获取今日活跃用户 (基于最后活跃时间)
        today_active_result = (
            db.table("users")
            .select("id", count="exact")
            .gte("updated_at", today)
            .execute()
        )
        today_active_users = today_active_result.count or 0

        # 获取未读通知数
        unread_notifications_result = (
            db.table("user_notifications")
            .select("id", count="exact")
            .eq("is_read", False)
            .execute()
        )
        unread_notifications = unread_notifications_result.count or 0

        return {
            "total_users": total_users,
            "total_courses": total_courses,
            "total_questions": total_questions,
            "total_trivia": total_trivia,
            "today_new_users": today_new_users,
            "today_active_users": today_active_users,
            "unread_notifications": unread_notifications,
        }
    except Exception as e:
        return {
            "total_users": 0,
            "total_courses": 0,
            "total_questions": 0,
            "total_trivia": 0,
            "today_new_users": 0,
            "today_active_users": 0,
            "unread_notifications": 0,
            "error": str(e),
        }


@router.get("/recent-activities")
async def get_recent_activities(
    limit: int = Query(10, ge=1, le=50), admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """获取最近的管理员操作日志"""
    try:
        result = (
            db.table("admin_logs")
            .select("*, admins(name)")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )

        activities = []
        for log in result.data:
            activities.append(
                {
                    "id": log["id"],
                    "action": log["action"],
                    "admin_name": log["admins"]["name"]
                    if log.get("admins")
                    else "Unknown",
                    "details": log.get("details", {}),
                    "created_at": log["created_at"],
                }
            )

        return {"activities": activities}
    except Exception as e:
        return {"activities": [], "error": str(e)}


@router.get("/user-growth")
async def get_user_growth(
    days: int = Query(30, ge=7, le=365), admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)
):
    """获取用户增长趋势"""
    try:
        end_date = datetime.utcnow().date()
        start_date = end_date - timedelta(days=days)

        # 获取时间范围内的用户注册数据
        result = (
            db.table("users")
            .select("created_at")
            .gte("created_at", start_date.isoformat())
            .lte("created_at", end_date.isoformat())
            .execute()
        )

        # 按日期统计
        date_counts = {}
        for user in result.data:
            date = user["created_at"][:10]  # 提取日期部分
            date_counts[date] = date_counts.get(date, 0) + 1

        # 填充缺失的日期
        current = start_date
        growth_data = []
        while current <= end_date:
            date_str = current.isoformat()
            growth_data.append(
                {"date": date_str, "count": date_counts.get(date_str, 0)}
            )
            current += timedelta(days=1)

        return {"growth": growth_data}
    except Exception as e:
        return {"growth": [], "error": str(e)}


@router.get("/activity")
async def get_recent_activity(admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)):
    """获取最近活动日志"""
    try:
        # 获取最近50条日志
        result = (
            db.table("admin_logs")
            .select("*, admins(username)")
            .order("created_at", desc=True)
            .limit(50)
            .execute()
        )
        data = result.data or []
        
        # 转换格式
        activities = []
        for item in data:
            activities.append({
                "id": item["id"],
                "admin": item["admins"]["username"] if item.get("admins") else "unknown",
                "action": item["action"],
                "details": str(item["details"]),
                "time": item["created_at"]
            })
            
        return activities
    except Exception as e:
        print(f"获取活动日志失败: {e}")
        return []
        
@router.get("/system")
async def get_system_status(admin: dict = Depends(get_current_admin), db: Client = Depends(get_db)):
    """获取系统状态"""
    try:
        # 简单检查Supabase连接
        start_time = datetime.now()
        db.table("users").select("id").limit(1).execute()
        latency = (datetime.now() - start_time).total_seconds() * 1000
        
        return {
            "status": "healthy",
            "latency_ms": round(latency, 2),
            "version": "1.0.0",
            "environment": "production" 
        }
    except Exception as e:
        return {
            "status": "degraded",
            "error": str(e),
            "version": "1.0.0"
        }
