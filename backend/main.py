"""
GeoExplorer FastAPI Backend
地理探索学习应用后端服务
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from db_service import init_db, close_db
from routes import (
    users_router,
    trivia_router,
    levels_router,
    mistakes_router,
    geo_features_router,
    ar_landforms_router,
    auth_router,
    questions_router,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用生命周期管理"""
    # 启动时初始化数据库
    print("🚀 Starting GeoExplorer API...")
    await init_db()
    print(f"✅ {settings.app_name} started successfully!")

    yield

    # 关闭时清理资源
    print("👋 Shutting down...")
    await close_db()


# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="GeoExplorer 地理探索学习应用 API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(trivia_router)
app.include_router(levels_router)
app.include_router(mistakes_router)
app.include_router(geo_features_router)
app.include_router(ar_landforms_router)
app.include_router(questions_router)


@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {
        "message": "Welcome to GeoExplorer API",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
