"""
Authentication Models
Pydantic schemas for authentication requests and responses.
"""

from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import Optional
from datetime import datetime
from uuid import UUID
import re


class SendCodeRequest(BaseModel):
    """Request schema for sending verification code."""
    target: str = Field(..., description="Email or phone number")
    type: str = Field(..., pattern="^(register|login)$", description="Code type: register or login")
    
    @field_validator('target')
    @classmethod
    def validate_target(cls, v: str) -> str:
        """Validate that target is either email or phone."""
        # Check if it's an email
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        # Check if it's a phone number (simple validation)
        phone_pattern = r'^\+?[1-9]\d{6,14}$'
        
        if re.match(email_pattern, v) or re.match(phone_pattern, v.replace(' ', '').replace('-', '')):
            return v
        raise ValueError('Target must be a valid email or phone number')


class RegisterRequest(BaseModel):
    """Request schema for user registration."""
    email: Optional[str] = Field(None, description="User email")
    phone: Optional[str] = Field(None, description="User phone number")
    code: str = Field(..., min_length=6, max_length=6, description="Verification code")
    name: str = Field(..., min_length=1, max_length=100, description="User display name")
    password: str = Field(..., min_length=6, max_length=100, description="User password")
    avatar_url: Optional[str] = None
    
    @field_validator('email', 'phone')
    @classmethod
    def at_least_one_contact(cls, v, info):
        return v
    
    def model_post_init(self, __context):
        """Ensure at least one of email or phone is provided."""
        if not self.email and not self.phone:
            raise ValueError('At least one of email or phone must be provided')


class LoginPasswordRequest(BaseModel):
    """Request schema for password login."""
    email: Optional[str] = Field(None, description="User email")
    phone: Optional[str] = Field(None, description="User phone number")
    password: str = Field(..., description="User password")
    
    def model_post_init(self, __context):
        """Ensure at least one of email or phone is provided."""
        if not self.email and not self.phone:
            raise ValueError('At least one of email or phone must be provided')


class LoginCodeRequest(BaseModel):
    """Request schema for verification code login."""
    email: Optional[str] = Field(None, description="User email")
    phone: Optional[str] = Field(None, description="User phone number")
    code: str = Field(..., min_length=6, max_length=6, description="Verification code")
    
    def model_post_init(self, __context):
        """Ensure at least one of email or phone is provided."""
        if not self.email and not self.phone:
            raise ValueError('At least one of email or phone must be provided')


class TokenResponse(BaseModel):
    """Response schema containing access and refresh tokens."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Access token expiry in seconds")


class RefreshRequest(BaseModel):
    """Request schema for refreshing access token."""
    refresh_token: str = Field(..., description="Refresh token")


class UserAuthResponse(BaseModel):
    """User information response for authenticated requests."""
    id: UUID
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    level: str = "初学者"
    total_stars: int = 0
    is_verified: bool = False
    created_at: datetime
    
    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    """Simple message response."""
    message: str
    success: bool = True
