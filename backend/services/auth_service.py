"""
Authentication Service
Core authentication logic including JWT token management and password hashing.
"""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import UUID

from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import Client

from config import settings
from services.supabase_client import get_db

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTP Bearer token security
security = HTTPBearer()


def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: str, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    
    Args:
        user_id: The user's UUID
        expires_delta: Optional custom expiry time
    
    Returns:
        Encoded JWT token
    """
    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    
    expire = datetime.now(timezone.utc) + expires_delta
    
    to_encode = {
        "sub": str(user_id),
        "exp": expire,
        "type": "access"
    }
    
    return jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token() -> str:
    """
    Create a cryptographically secure refresh token.
    
    Returns:
        Random token string
    """
    return secrets.token_urlsafe(64)


def hash_token(token: str) -> str:
    """Hash a token for storage."""
    return hashlib.sha256(token.encode()).hexdigest()


async def store_refresh_token(
    db: Client,
    user_id: str,
    token: str,
    expires_delta: Optional[timedelta] = None
) -> None:
    """
    Store a refresh token in the database.
    
    Args:
        db: Supabase client
        user_id: The user's UUID
        token: The refresh token to store
        expires_delta: Optional custom expiry time
    """
    if expires_delta is None:
        expires_delta = timedelta(days=settings.refresh_token_expire_days)
    
    expires_at = datetime.now(timezone.utc) + expires_delta
    token_hash = hash_token(token)
    
    db.table("refresh_tokens").insert({
        "user_id": str(user_id),
        "token_hash": token_hash,
        "expires_at": expires_at.isoformat(),
        "revoked": False
    }).execute()


async def verify_refresh_token(db: Client, token: str) -> Optional[str]:
    """
    Verify a refresh token and return the associated user ID.
    
    Args:
        db: Supabase client
        token: The refresh token to verify
    
    Returns:
        User ID if valid, None otherwise
    """
    token_hash = hash_token(token)
    now = datetime.now(timezone.utc).isoformat()
    
    response = db.table("refresh_tokens").select("user_id").eq("token_hash", token_hash).eq("revoked", False).gte("expires_at", now).execute()
    
    if not response.data:
        return None
    
    return response.data[0]["user_id"]


async def revoke_refresh_token(db: Client, token: str) -> bool:
    """
    Revoke a refresh token.
    
    Args:
        db: Supabase client
        token: The refresh token to revoke
    
    Returns:
        True if revoked, False if not found
    """
    token_hash = hash_token(token)
    
    response = db.table("refresh_tokens").update({"revoked": True}).eq("token_hash", token_hash).execute()
    
    return len(response.data) > 0 if response.data else False


async def revoke_all_user_tokens(db: Client, user_id: str) -> int:
    """
    Revoke all refresh tokens for a user.
    
    Args:
        db: Supabase client
        user_id: The user's UUID
    
    Returns:
        Number of tokens revoked
    """
    response = db.table("refresh_tokens").update({"revoked": True}).eq("user_id", str(user_id)).eq("revoked", False).execute()
    
    return len(response.data) if response.data else 0


def decode_access_token(token: str) -> Optional[dict]:
    """
    Decode and validate a JWT access token.
    
    Args:
        token: The JWT token to decode
    
    Returns:
        Token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )
        
        if payload.get("type") != "access":
            return None
        
        return payload
    except JWTError:
        return None


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Client = Depends(get_db)
) -> dict:
    """
    FastAPI dependency to get the current authenticated user.
    
    Args:
        credentials: Bearer token from request
        db: Supabase client
    
    Returns:
        User data dict
    
    Raises:
        HTTPException: If authentication fails
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise credentials_exception
    
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    # Fetch user from database
    response = db.table("users").select("*").eq("id", user_id).single().execute()
    
    if not response.data:
        raise credentials_exception
    
    return response.data


async def get_user_by_email(db: Client, email: str) -> Optional[dict]:
    """Get a user by email."""
    response = db.table("users").select("*").eq("email", email).execute()
    return response.data[0] if response.data else None


async def get_user_by_phone(db: Client, phone: str) -> Optional[dict]:
    """Get a user by phone number."""
    response = db.table("users").select("*").eq("phone", phone).execute()
    return response.data[0] if response.data else None


async def get_user_by_email_or_phone(
    db: Client,
    email: Optional[str] = None,
    phone: Optional[str] = None
) -> Optional[dict]:
    """Get a user by email or phone."""
    if email:
        return await get_user_by_email(db, email)
    if phone:
        return await get_user_by_phone(db, phone)
    return None
