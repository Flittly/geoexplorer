from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
import os
from supabase import Client

from backend.services.supabase_client import get_db
from admin.backend.models.admin_models import AdminLogin, AdminToken, AdminInfo

# JWT配置
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 1

security = HTTPBearer()
router = APIRouter(prefix="/api/admin/auth", tags=["Admin Auth"])


def create_access_token(admin_id: str, username: str, role: str) -> str:
    """创建管理员访问令牌"""
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode = {
        "admin_id": admin_id,
        "username": username,
        "role": role,
        "type": "admin",
        "exp": expire,
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verify_admin_token(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """验证管理员令牌"""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="无效的管理员令牌"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="令牌无效或已过期",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_admin(
    token_data: dict = Depends(verify_admin_token), db: Client = Depends(get_db)
):
    """获取当前管理员信息"""
    result = (
        db.table("admins")
        .select("*")
        .eq("id", token_data["admin_id"])
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="管理员不存在"
        )
    return result.data


@router.post("/login", response_model=AdminToken)
async def admin_login(login_data: AdminLogin, db: Client = Depends(get_db)):
    """管理员登录"""
    # 查询管理员
    result = (
        db.table("admins")
        .select("*")
        .eq("username", login_data.username)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误"
        )

    admin = result.data

    # 检查是否启用
    if not admin.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="账户已被禁用"
        )

    # 验证密码
    try:
        # Debug: 打印哈希值看一下 (只在开发环境使用，生产环境请删除)
        # print(f"DEBUG: Checking password for user {admin['username']}")
        # print(f"DEBUG: Stored hash repr: {repr(admin.get('password_hash'))}")

        password_hash = admin.get("password_hash")
        if not password_hash:
            raise ValueError("Password hash is missing")

        # 尝试清理哈希值（去除可能的空白字符）
        password_hash = password_hash.strip()

        if not bcrypt.checkpw(
            login_data.password.encode("utf-8"), password_hash.encode("utf-8")
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="用户名或密码错误"
            )
    except ValueError as e:
        # 捕获 bcrypt 的 Invalid salt 或其他格式错误
        print(f"ERROR: Password verification failed: {e}")
        print(f"ERROR: Stored hash: {repr(admin.get('password_hash'))}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"系统内部错误: 存储的密码哈希格式无效 ({str(e)})",
        )

    # 更新最后登录时间
    db.table("admins").update({"last_login_at": datetime.utcnow().isoformat()}).eq(
        "id", admin["id"]
    ).execute()

    # 创建令牌
    access_token = create_access_token(
        admin_id=admin["id"],
        username=admin["username"],
        role=admin.get("role", "editor"),
    )

    # 记录登录日志
    log_admin_action(admin["id"], "login", None, None, {"ip": "unknown"})

    return AdminToken(
        access_token=access_token,
        admin_id=admin["id"],
        username=admin["username"],
        name=admin.get("name", admin["username"]),
        role=admin.get("role", "editor"),
    )


@router.get("/me", response_model=AdminInfo)
async def get_admin_info(admin: dict = Depends(get_current_admin)):
    """获取当前管理员信息"""
    return AdminInfo(
        id=admin["id"],
        username=admin["username"],
        email=admin["email"],
        name=admin.get("name"),
        role=admin.get("role", "editor"),
        is_active=admin.get("is_active", True),
        last_login_at=admin.get("last_login_at"),
        created_at=admin["created_at"],
    )


def log_admin_action(
    admin_id: str,
    action: str,
    target_table: Optional[str],
    target_id: Optional[str],
    details: dict,
):
    """记录管理员操作日志"""
    try:
        db = get_db()
        db.table("admin_logs").insert(
            {
                "admin_id": admin_id,
                "action": action,
                "target_table": target_table,
                "target_id": target_id,
                "details": details,
                "created_at": datetime.utcnow().isoformat(),
            }
        ).execute()
    except Exception as e:
        print(f"记录日志失败: {e}")
