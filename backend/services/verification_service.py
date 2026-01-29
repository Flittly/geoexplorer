"""
Verification Code Service
Handles generation, sending, and verification of codes.
"""

import random
import string
from datetime import datetime, timedelta, timezone
from typing import Optional
from supabase import Client

from config import settings


def generate_code(length: int = 6) -> str:
    """Generate a random numeric verification code."""
    return ''.join(random.choices(string.digits, k=length))


async def send_verification_code(
    db: Client,
    target: str,
    code_type: str
) -> str:
    """
    Generate and send a verification code.
    
    In development, this prints to console.
    In production, integrate with SMS/email service.
    
    Args:
        db: Supabase client
        target: Email or phone number
        code_type: 'register' or 'login'
    
    Returns:
        The generated code (for development purposes)
    """
    # Generate code
    code = generate_code()
    
    # Calculate expiry
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=settings.verification_code_expire_minutes
    )
    
    # Mark all previous codes for this target as used
    db.table("verification_codes").update({"used": True}).eq("target", target).eq("used", False).execute()
    
    # Store code in database
    db.table("verification_codes").insert({
        "target": target,
        "code": code,
        "type": code_type,
        "expires_at": expires_at.isoformat(),
        "used": False
    }).execute()
    
    # In development: print to console
    print("\n" + "=" * 50)
    print(f"📧 验证码发送至: {target}")
    print(f"🔢 验证码: {code}")
    print(f"📝 类型: {'注册' if code_type == 'register' else '登录'}")
    print(f"⏰ 有效期: {settings.verification_code_expire_minutes} 分钟")
    print("=" * 50 + "\n")
    
    # TODO: In production, integrate with SMS/email service
    # Example:
    # if '@' in target:
    #     send_email(target, f"Your verification code is: {code}")
    # else:
    #     send_sms(target, f"Your verification code is: {code}")
    
    return code


async def verify_code(
    db: Client,
    target: str,
    code: str,
    code_type: str
) -> bool:
    """
    Verify a verification code.
    
    Args:
        db: Supabase client
        target: Email or phone number
        code: The code to verify
        code_type: 'register' or 'login'
    
    Returns:
        True if code is valid, False otherwise
    """
    now = datetime.now(timezone.utc).isoformat()
    
    # Find valid code
    response = db.table("verification_codes").select("*").eq("target", target).eq("code", code).eq("type", code_type).eq("used", False).gte("expires_at", now).execute()
    
    if not response.data:
        return False
    
    # Mark code as used
    code_id = response.data[0]["id"]
    db.table("verification_codes").update({"used": True}).eq("id", code_id).execute()
    
    return True


async def cleanup_expired_codes(db: Client) -> int:
    """
    Clean up expired verification codes.
    
    Returns:
        Number of deleted codes
    """
    now = datetime.now(timezone.utc).isoformat()
    
    # Delete expired codes
    response = db.table("verification_codes").delete().lt("expires_at", now).execute()
    
    return len(response.data) if response.data else 0
