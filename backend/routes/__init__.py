# Routes package
from .users import router as users_router
from .trivia import router as trivia_router
from .levels import router as levels_router
from .mistakes import router as mistakes_router
from .geo_features import router as geo_features_router
from .ar_landforms import router as ar_landforms_router
from .auth import router as auth_router

__all__ = [
    "users_router",
    "trivia_router", 
    "levels_router",
    "mistakes_router",
    "geo_features_router",
    "ar_landforms_router",
    "auth_router",
]
