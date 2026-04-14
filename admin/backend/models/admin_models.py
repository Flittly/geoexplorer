from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID

# ==================== 管理员认证模型 ====================


class AdminLogin(BaseModel):
    username: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6)


class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"
    admin_id: str
    username: str
    name: str
    role: str


class AdminInfo(BaseModel):
    id: str
    username: str
    email: str
    name: Optional[str]
    role: str
    is_active: bool
    last_login_at: Optional[datetime]
    created_at: datetime


# ==================== 题目(题库)模型 ====================


class QuestionBase(BaseModel):
    question: str = Field(..., min_length=1, max_length=1000)
    options: List[str]
    correct_answer: int = Field(..., ge=0, le=5)
    explanation: Optional[str] = None
    category: str = Field(..., pattern="^(physical|human|regional)$")
    difficulty: str = Field(..., pattern="^(easy|medium|hard)$")
    level_id: Optional[str] = None
    image_url: Optional[str] = None

    @field_validator("options")
    @classmethod
    def validate_options(cls, v):
        if len(v) < 2 or len(v) > 6:
            raise ValueError("选项数量必须在2-6个之间")
        return v


class QuestionCreate(QuestionBase):
    pass


class QuestionUpdate(BaseModel):
    question: Optional[str] = Field(None, max_length=1000)
    options: Optional[List[str]] = None
    correct_answer: Optional[int] = Field(None, ge=0, le=5)
    explanation: Optional[str] = None
    category: Optional[str] = Field(None, pattern="^(physical|human|regional)$")
    difficulty: Optional[str] = Field(None, pattern="^(easy|medium|hard)$")
    level_id: Optional[str] = None
    image_url: Optional[str] = None

    @field_validator("options")
    @classmethod
    def validate_options(cls, v):
        if v is not None and (len(v) < 2 or len(v) > 6):
            raise ValueError("选项数量必须在2-6个之间")
        return v


class QuestionResponse(QuestionBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class QuestionListResponse(BaseModel):
    questions: List[QuestionResponse]
    total: int
    page: int
    page_size: int


# ==================== 每日百科管理模型 ====================


class TriviaCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    image_url: Optional[str] = None
    location: Optional[str] = Field(None, max_length=100)
    region: Optional[str] = Field(None, max_length=100)
    featured_date: Optional[str] = None  # YYYY-MM-DD format


class TriviaUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    image_url: Optional[str] = None
    location: Optional[str] = Field(None, max_length=100)
    region: Optional[str] = Field(None, max_length=100)
    featured_date: Optional[str] = None


# ==================== 课程(关卡)管理模型 ====================


class LevelCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    order_index: int = Field(..., ge=0)
    unlock_requirement: int = Field(default=0, ge=0)
    image_url: Optional[str] = None
    questions: Optional[List[str]] = None  # 关联的题目ID列表


class LevelUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    order_index: Optional[int] = Field(None, ge=0)
    unlock_requirement: Optional[int] = Field(None, ge=0)
    image_url: Optional[str] = None


class LevelDetailResponse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    order_index: int
    unlock_requirement: int
    image_url: Optional[str]
    created_at: datetime
    question_count: int


# ==================== 用户管理模型 ====================


class UserListResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str]
    level: str
    total_stars: int
    is_verified: bool
    created_at: datetime
    last_active: Optional[datetime]


class UserUpdateByAdmin(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    email: Optional[str] = Field(None, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)
    level: Optional[str] = Field(None, max_length=50)
    total_stars: Optional[int] = Field(None, ge=0)
    is_verified: Optional[bool] = None
    is_active: Optional[bool] = Field(default=True)  # 软删除标记


class UserProgressUpdate(BaseModel):
    level_id: str
    status: str = Field(..., pattern="^(locked|active|completed)$")
    score: Optional[int] = Field(None, ge=0)
    stars: Optional[int] = Field(None, ge=0, le=3)
    completion_percentage: Optional[int] = Field(None, ge=0, le=100)


# ==================== 消息通知模型 ====================


class NotificationCreate(BaseModel):
    user_id: Optional[str] = None  # None表示全员广播
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1)
    type: str = Field(
        default="system", pattern="^(system|course|achievement|reminder)$"
    )
    is_broadcast: bool = False


class NotificationResponse(BaseModel):
    id: str
    user_id: Optional[str]
    title: str
    content: str
    type: str
    is_read: bool
    is_broadcast: bool
    created_at: datetime
    read_at: Optional[datetime]


class NotificationListResponse(BaseModel):
    notifications: List[NotificationResponse]
    total: int


# ==================== 统计数据模型 ====================


class DashboardStats(BaseModel):
    total_users: int
    total_courses: int
    total_questions: int
    total_trivia: int
    today_new_users: int
    today_active_users: int
    unread_notifications: int


class RecentActivity(BaseModel):
    id: str
    action: str
    admin_name: str
    details: str
    created_at: datetime
