"""
SQLAlchemy Database Models for GeoExplorer
"""

import uuid
from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    ForeignKey,
    Text,
    Enum as SQLEnum,
    JSON,
    Table,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum

Base = declarative_base()


class UserLevel(str, enum.Enum):
    BEGINNER = "beginner"
    LEARNER = "learner"
    SCHOLAR = "scholar"
    EXPLORER = "explorer"
    MASTER = "master"


class GenderType(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"


class ProgressStatus(str, enum.Enum):
    LOCKED = "locked"
    ACTIVE = "active"
    COMPLETED = "completed"


class MasteryLevel(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class CategoryType(str, enum.Enum):
    PHYSICAL = "physical"
    HUMAN = "human"
    REGIONAL = "regional"


class LandformType(str, enum.Enum):
    BASIN = "basin"
    PEAK = "peak"
    VALLEY = "valley"
    CLIFF = "cliff"


class User(Base):
    """用户表"""

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=True)
    phone = Column(String(20), unique=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    avatar_url = Column(Text, nullable=True)
    gender = Column(SQLEnum(GenderType), nullable=True)
    age = Column(Integer, nullable=True)
    level = Column(SQLEnum(UserLevel), default=UserLevel.BEGINNER)
    total_stars = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    refresh_tokens = relationship(
        "RefreshToken", back_populates="user", cascade="all, delete-orphan"
    )
    level_progress = relationship(
        "UserLevelProgress", back_populates="user", cascade="all, delete-orphan"
    )
    mistakes = relationship(
        "Mistake", back_populates="user", cascade="all, delete-orphan"
    )
    quiz_results = relationship(
        "QuizResult", back_populates="user", cascade="all, delete-orphan"
    )


class RefreshToken(Base):
    """刷新令牌表"""

    __tablename__ = "refresh_tokens"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    token = Column(String(500), unique=True, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="refresh_tokens")


class VerificationCode(Base):
    """验证码表"""

    __tablename__ = "verification_codes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    target = Column(String(255), nullable=False)  # email or phone
    code = Column(String(10), nullable=False)
    type = Column(String(20), nullable=False)  # register, login
    expires_at = Column(DateTime(timezone=True), nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Level(Base):
    """关卡表"""

    __tablename__ = "levels"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    order_index = Column(Integer, nullable=False)
    unlock_requirement = Column(Integer, default=0)
    image_url = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    questions = relationship(
        "Question", back_populates="level", cascade="all, delete-orphan"
    )
    user_progress = relationship(
        "UserLevelProgress", back_populates="level", cascade="all, delete-orphan"
    )


class Question(Base):
    """题目表"""

    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    level_id = Column(
        UUID(as_uuid=True), ForeignKey("levels.id", ondelete="CASCADE"), nullable=False
    )
    question = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # List of options
    correct_answer = Column(Integer, nullable=False)  # Index of correct option
    explanation = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    level = relationship("Level", back_populates="questions")
    quiz_results = relationship(
        "QuizResult", back_populates="question", cascade="all, delete-orphan"
    )


class UserLevelProgress(Base):
    """用户关卡进度表"""

    __tablename__ = "user_level_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    level_id = Column(
        UUID(as_uuid=True), ForeignKey("levels.id", ondelete="CASCADE"), nullable=False
    )
    status = Column(SQLEnum(ProgressStatus), default=ProgressStatus.LOCKED)
    score = Column(Integer, default=0)
    stars = Column(Integer, default=0)
    completion_percentage = Column(Float, default=0)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="level_progress")
    level = relationship("Level", back_populates="user_progress")


class QuizResult(Base):
    """答题结果表"""

    __tablename__ = "quiz_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    question_id = Column(
        UUID(as_uuid=True),
        ForeignKey("questions.id", ondelete="CASCADE"),
        nullable=False,
    )
    selected_answer = Column(Integer, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="quiz_results")
    question = relationship("Question", back_populates="quiz_results")


class Mistake(Base):
    """错题本表"""

    __tablename__ = "mistakes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    title = Column(String(200), nullable=False)
    question = Column(Text, nullable=True)
    category = Column(SQLEnum(CategoryType), default=CategoryType.PHYSICAL)
    mastery_level = Column(SQLEnum(MasteryLevel), default=MasteryLevel.LOW)
    image_url = Column(Text, nullable=True)
    explanation = Column(Text, nullable=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="mistakes")


class DailyTrivia(Base):
    """每日百科表"""

    __tablename__ = "daily_trivia"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(Text, nullable=True)
    location = Column(String(100), nullable=True)
    region = Column(String(100), nullable=True)
    featured_date = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class GeographicFeature(Base):
    """地理特征表"""

    __tablename__ = "geographic_features"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    feature_type = Column(String(50), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    region = Column(String(100), nullable=True)
    image_url = Column(Text, nullable=True)
    stats = Column(JSON, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ARLandform(Base):
    """AR地貌表"""

    __tablename__ = "ar_landforms"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(SQLEnum(LandformType), nullable=False)
    image_url = Column(Text, nullable=True)
    elevation = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# Indexes for better query performance
from sqlalchemy import Index

Index("idx_users_email", User.email)
Index("idx_users_phone", User.phone)
Index("idx_refresh_tokens_token", RefreshToken.token)
Index("idx_refresh_tokens_user_id", RefreshToken.user_id)
Index("idx_verification_codes_target", VerificationCode.target)
Index("idx_levels_order", Level.order_index)
Index("idx_questions_level_id", Question.level_id)
Index(
    "idx_user_level_progress_user_level",
    UserLevelProgress.user_id,
    UserLevelProgress.level_id,
)
Index("idx_quiz_results_user_id", QuizResult.user_id)
Index("idx_mistakes_user_id", Mistake.user_id)
Index("idx_daily_trivia_featured_date", DailyTrivia.featured_date)
