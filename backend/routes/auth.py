"""
Auth Routes - 使用 SQLAlchemy
API endpoints for user registration, login, and token management.
"""

from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr
from jose import JWTError, jwt
from passlib.context import CryptContext

from config import settings
from db_service import get_db
from database import User, RefreshToken, VerificationCode

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Pydantic Models
class SendCodeRequest(BaseModel):
    target: str
    type: str  # register or login


class RegisterRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    code: str
    name: str
    password: str
    avatar_url: Optional[str] = None


class LoginPasswordRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str


class LoginCodeRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    code: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    level: str
    total_stars: int
    is_verified: bool
    created_at: str
    gender: Optional[str] = None
    age: Optional[int] = None


class MessageResponse(BaseModel):
    message: str
    success: bool = True


# Helper functions
def create_access_token(user_id: str) -> str:
    """创建访问令牌"""
    expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    to_encode = {"user_id": user_id, "exp": expire, "type": "access"}
    return jwt.encode(
        to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
    )


def create_refresh_token(user_id: str) -> str:
    """创建刷新令牌"""
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    to_encode = {"user_id": user_id, "exp": expire, "type": "refresh"}
    return jwt.encode(
        to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm
    )


def verify_token(token: str, token_type: str = "access") -> Optional[str]:
    """验证令牌并返回用户ID"""
    try:
        payload = jwt.decode(
            token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm]
        )
        if payload.get("type") != token_type:
            return None
        return payload.get("user_id")
    except JWTError:
        return None


def hash_password(password: str) -> str:
    """哈希密码"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """验证密码"""
    return pwd_context.verify(plain_password, hashed_password)


# Routes
@router.post("/send-code", response_model=MessageResponse)
async def send_code(request: SendCodeRequest, db: AsyncSession = Depends(get_db)):
    """发送验证码"""
    # 这里应该发送实际的验证码（邮件/短信）
    # 为了演示，我们直接存储一个固定验证码
    code = "123456"  # 实际应用中应该生成随机码

    verification = VerificationCode(
        target=request.target,
        code=code,
        type=request.type,
        expires_at=datetime.utcnow() + timedelta(minutes=5),
    )
    db.add(verification)
    await db.commit()

    return MessageResponse(message="验证码已发送")


@router.post("/register", response_model=TokenResponse)
async def register(request: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """用户注册"""
    # 验证验证码（简化版，直接检查123456）
    if request.code != "123456":
        raise HTTPException(status_code=400, detail="验证码错误")

    # 检查用户是否已存在
    if request.email:
        existing = await db.execute(select(User).where(User.email == request.email))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="该邮箱已注册")

    if request.phone:
        existing = await db.execute(select(User).where(User.phone == request.phone))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="该手机号已注册")

    # 创建新用户
    user = User(
        name=request.name,
        email=request.email,
        phone=request.phone,
        password_hash=hash_password(request.password),
        avatar_url=request.avatar_url,
        is_verified=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    # 生成令牌
    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))

    # 保存刷新令牌
    refresh = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.utcnow()
        + timedelta(days=settings.refresh_token_expire_days),
    )
    db.add(refresh)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/login/password", response_model=TokenResponse)
async def login_with_password(
    request: LoginPasswordRequest, db: AsyncSession = Depends(get_db)
):
    """密码登录"""
    # 查找用户
    query = select(User)
    if request.email:
        query = query.where(User.email == request.email)
    elif request.phone:
        query = query.where(User.phone == request.phone)
    else:
        raise HTTPException(status_code=400, detail="请提供邮箱或手机号")

    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="邮箱/手机号或密码错误")

    # 生成令牌
    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))

    # 保存刷新令牌
    refresh = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.utcnow()
        + timedelta(days=settings.refresh_token_expire_days),
    )
    db.add(refresh)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/login/code", response_model=TokenResponse)
async def login_with_code(
    request: LoginCodeRequest, db: AsyncSession = Depends(get_db)
):
    """验证码登录"""
    # 验证验证码
    if request.code != "123456":
        raise HTTPException(status_code=400, detail="验证码错误")

    # 查找用户
    query = select(User)
    if request.email:
        query = query.where(User.email == request.email)
    elif request.phone:
        query = query.where(User.phone == request.phone)
    else:
        raise HTTPException(status_code=400, detail="请提供邮箱或手机号")

    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    # 生成令牌
    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))

    # 保存刷新令牌
    refresh = RefreshToken(
        user_id=user.id,
        token=refresh_token,
        expires_at=datetime.utcnow()
        + timedelta(days=settings.refresh_token_expire_days),
    )
    db.add(refresh)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user(
    authorization: str = None, db: AsyncSession = Depends(get_db)
):
    """获取当前用户信息"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未提供有效的认证令牌")

    token = authorization.split(" ")[1]
    user_id = verify_token(token)

    if not user_id:
        raise HTTPException(status_code=401, detail="无效或过期的令牌")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    return UserResponse(
        id=str(user.id),
        name=user.name,
        email=user.email,
        phone=user.phone,
        avatar_url=user.avatar_url,
        level=user.level.value if user.level else "beginner",
        total_stars=user.total_stars,
        is_verified=user.is_verified,
        created_at=user.created_at.isoformat() if user.created_at else "",
        gender=user.gender.value if user.gender else None,
        age=user.age,
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshRequest, db: AsyncSession = Depends(get_db)):
    """刷新令牌"""
    user_id = verify_token(request.refresh_token, "refresh")

    if not user_id:
        raise HTTPException(status_code=401, detail="无效或过期的刷新令牌")

    # 检查刷新令牌是否存在且未被撤销
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token == request.refresh_token,
            RefreshToken.is_revoked == False,
        )
    )
    refresh = result.scalar_one_or_none()

    if not refresh:
        raise HTTPException(status_code=401, detail="刷新令牌无效")

    # 撤销旧令牌
    refresh.is_revoked = True

    # 生成新令牌
    access_token = create_access_token(user_id)
    new_refresh_token = create_refresh_token(user_id)

    # 保存新刷新令牌
    new_refresh = RefreshToken(
        user_id=user_id,
        token=new_refresh_token,
        expires_at=datetime.utcnow()
        + timedelta(days=settings.refresh_token_expire_days),
    )
    db.add(new_refresh)
    await db.commit()

    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=settings.access_token_expire_minutes * 60,
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(request: RefreshRequest, db: AsyncSession = Depends(get_db)):
    """退出登录"""
    # 撤销刷新令牌
    result = await db.execute(
        select(RefreshToken).where(RefreshToken.token == request.refresh_token)
    )
    refresh = result.scalar_one_or_none()

    if refresh:
        refresh.is_revoked = True
        await db.commit()

    return MessageResponse(message="已成功退出登录")
