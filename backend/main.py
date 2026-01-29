"""
GeoExplorer FastAPI Backend
地理探索学习应用后端服务
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from services.supabase_client import init_supabase
from routes import (
    users_router,
    trivia_router,
    levels_router,
    mistakes_router,
    geo_features_router,
    ar_landforms_router,
    auth_router,
)

# Create FastAPI application
app = FastAPI(
    title=settings.app_name,
    description="GeoExplorer 地理探索学习应用 API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
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

@app.on_event("startup")
async def startup_event():
    """Initialize services on application startup."""
    init_supabase()
    print(f"🚀 {settings.app_name} started successfully!")

@app.get("/")
async def root():
    """Root endpoint - API health check."""
    return {
        "message": "Welcome to GeoExplorer API",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
