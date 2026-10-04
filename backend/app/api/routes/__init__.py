from app.api.routes.health import router as health_router
from app.api.routes.prompt import router as prompt_router
from app.api.routes.routing import router as routing_router
from app.api.routes.models import router as models_router
from app.api.routes.cache import router as cache_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.feedback import router as feedback_router
from app.api.routes.settings import router as settings_router
from app.api.routes.auth import router as auth_router
from app.api.routes.chat import router as chat_router
from app.api.routes.subscription import router as subscription_router

__all__ = [
    "health_router",
    "prompt_router",
    "routing_router",
    "models_router",
    "cache_router",
    "analytics_router",
    "feedback_router",
    "settings_router",
    "auth_router",
    "chat_router",
    "subscription_router"
]
