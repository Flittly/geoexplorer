"""
Database Service for GeoExplorer
使用 SQLAlchemy + asyncpg 管理 PostgreSQL 连接
"""

from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from config import settings

# 创建异步引擎
engine = create_async_engine(
    settings.database_url,
    echo=settings.debug,
    pool_size=5,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
)

# 创建异步会话工厂
AsyncSessionFactory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# 声明基类
Base = declarative_base()


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    获取数据库会话的依赖注入函数
    用法: db: AsyncSession = Depends(get_db)
    """
    async with AsyncSessionFactory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """初始化数据库，创建所有表"""
    from database import Base  # 导入所有模型

    async with engine.begin() as conn:
        # 创建所有表
        await conn.run_sync(Base.metadata.create_all)
        print("✅ Database tables created successfully")


async def drop_db():
    """删除所有表（谨慎使用）"""
    from database import Base

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        print("⚠️ All database tables dropped")


async def close_db():
    """关闭数据库连接"""
    await engine.dispose()
    print("🔒 Database connection closed")
