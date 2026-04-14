"""
管理后台主入口
将管理后台路由集成到现有的FastAPI应用
"""

from fastapi import APIRouter

# 导入所有管理后台路由
from admin.backend.routes.auth_admin import router as auth_router
from admin.backend.routes.dashboard_admin import router as dashboard_router
from admin.backend.routes.questions_admin import router as questions_router
from admin.backend.routes.trivia_admin import router as trivia_router
from admin.backend.routes.levels_admin import router as levels_router
from admin.backend.routes.users_admin import router as users_router
from admin.backend.routes.notifications_admin import router as notifications_router

# 创建管理后台路由集合
admin_router = APIRouter(tags=["Admin"])

# 注册所有路由
admin_router.include_router(auth_router)
admin_router.include_router(dashboard_router)
admin_router.include_router(questions_router)
admin_router.include_router(trivia_router)
admin_router.include_router(levels_router)
admin_router.include_router(users_router)
admin_router.include_router(notifications_router)

__all__ = ["admin_router"]
