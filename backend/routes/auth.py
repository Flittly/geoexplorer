"""
Authentication Routes
API endpoints for user registration, login, and token management.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from supabase import Client

from config import settings
from models.auth import (
    SendCodeRequest,
    RegisterRequest,
    LoginPasswordRequest,
    LoginCodeRequest,
    TokenResponse,
    RefreshRequest,
    UserAuthResponse,
    MessageResponse,
)
from services.supabase_client import get_db
from services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    store_refresh_token,
    verify_refresh_token,
    revoke_refresh_token,
    get_current_user,
    get_user_by_email_or_phone,
)
from services.verification_service import (
    send_verification_code,
    verify_code,
)

router = APIRouter(prefix="/api/auth", tags=["authentication"])


@router.post("/send-code", response_model=MessageResponse)
async def send_code(request: SendCodeRequest, db: Client = Depends(get_db)):
    """
    Send a verification code to email or phone.
    
    Used for both registration and login.
    """
    # Check if user exists for login, or doesn't exist for register
    user = await get_user_by_email_or_phone(
        db,
        email=request.target if '@' in request.target else None,
        phone=request.target if '@' not in request.target else None
    )
    
    if request.type == "register" and user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该账号已被注册 / Account already registered"
        )
    
    if request.type == "login" and not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="账号不存在 / Account not found"
        )
    
    # Send verification code
    await send_verification_code(db, request.target, request.type)
    
    return MessageResponse(
        message=f"验证码已发送至 {request.target} / Verification code sent",
        success=True
    )


@router.post("/register", response_model=TokenResponse)
async def register(request: RegisterRequest, db: Client = Depends(get_db)):
    """
    Register a new user with verification code.
    """
    target = request.email or request.phone
    
    # Check if user already exists
    existing_user = await get_user_by_email_or_phone(db, request.email, request.phone)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该账号已被注册 / Account already registered"
        )
    
    # Verify the code
    is_valid = await verify_code(db, target, request.code, "register")
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="验证码无效或已过期 / Invalid or expired verification code"
        )
    
    # Hash password
    password_hash = hash_password(request.password)
    
    # Create user
    user_data = {
        "name": request.name,
        "email": request.email,
        "phone": request.phone,
        "password_hash": password_hash,
        "avatar_url": request.avatar_url,
        "is_verified": True,
        "level": "初学者",
        "total_stars": 0
    }
    
    response = db.table("users").insert(user_data).execute()
    
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="创建用户失败 / Failed to create user"
        )
    
    user = response.data[0]
    user_id = user["id"]
    
    # Generate tokens
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token()
    
    # Store refresh token
    await store_refresh_token(db, user_id, refresh_token)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60
    )


@router.post("/login/password", response_model=TokenResponse)
async def login_with_password(request: LoginPasswordRequest, db: Client = Depends(get_db)):
    """
    Login with email/phone and password.
    """
    # Find user
    user = await get_user_by_email_or_phone(db, request.email, request.phone)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="账号或密码错误 / Invalid credentials"
        )
    
    # Verify password
    if not user.get("password_hash"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="该账号未设置密码，请使用验证码登录 / No password set, please use code login"
        )
    
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="账号或密码错误 / Invalid credentials"
        )
    
    user_id = user["id"]
    
    # Generate tokens
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token()
    
    # Store refresh token
    await store_refresh_token(db, user_id, refresh_token)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60
    )


@router.post("/login/code", response_model=TokenResponse)
async def login_with_code(request: LoginCodeRequest, db: Client = Depends(get_db)):
    """
    Login with email/phone and verification code.
    """
    target = request.email or request.phone
    
    # Find user
    user = await get_user_by_email_or_phone(db, request.email, request.phone)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="账号不存在 / Account not found"
        )
    
    # Verify the code
    is_valid = await verify_code(db, target, request.code, "login")
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="验证码无效或已过期 / Invalid or expired verification code"
        )
    
    user_id = user["id"]
    
    # Generate tokens
    access_token = create_access_token(user_id)
    refresh_token = create_refresh_token()
    
    # Store refresh token
    await store_refresh_token(db, user_id, refresh_token)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.access_token_expire_minutes * 60
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshRequest, db: Client = Depends(get_db)):
    """
    Refresh the access token using a refresh token.
    """
    # Verify refresh token
    user_id = await verify_refresh_token(db, request.refresh_token)
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="无效的刷新令牌 / Invalid refresh token"
        )
    
    # Revoke old refresh token
    await revoke_refresh_token(db, request.refresh_token)
    
    # Generate new tokens
    access_token = create_access_token(user_id)
    new_refresh_token = create_refresh_token()
    
    # Store new refresh token
    await store_refresh_token(db, user_id, new_refresh_token)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=settings.access_token_expire_minutes * 60
    )


@router.post("/logout", response_model=MessageResponse)
async def logout(
    request: RefreshRequest,
    db: Client = Depends(get_db)
):
    """
    Logout by revoking the refresh token.
    """
    revoked = await revoke_refresh_token(db, request.refresh_token)
    
    return MessageResponse(
        message="已登出 / Logged out successfully",
        success=revoked
    )


@router.get("/me", response_model=UserAuthResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """
    Get the current authenticated user's information.
    """
    return current_user
