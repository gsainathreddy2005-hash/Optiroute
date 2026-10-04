import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.core.redis import cache_manager
from app.api.routes import (
    health_router,
    prompt_router,
    routing_router,
    models_router,
    cache_router,
    analytics_router,
    feedback_router,
    settings_router,
    auth_router,
    chat_router,
    subscription_router
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("optiroute.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    logger.info("Initializing cache manager...")
    await cache_manager.init()
    
    yield
    logger.info("Shutting down application...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="NLP-Based Prompt Complexity Analysis & Cost-Aware Multi-LLM Routing Platform",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prefix = settings.API_V1_STR
app.include_router(health_router, prefix=prefix, tags=["Health"])
app.include_router(auth_router, prefix=prefix, tags=["Authentication"])
app.include_router(prompt_router, prefix=prefix, tags=["Prompt Processing"])
app.include_router(chat_router, prefix=prefix, tags=["ChatGPT History"])
app.include_router(subscription_router, prefix=prefix, tags=["Subscription"])
app.include_router(routing_router, prefix=prefix, tags=["Intelligent Routing"])
app.include_router(models_router, prefix=prefix, tags=["LLM Model Registry"])
app.include_router(cache_router, prefix=prefix, tags=["Cache Memory"])
app.include_router(analytics_router, prefix=prefix, tags=["Analytics"])
app.include_router(feedback_router, prefix=prefix, tags=["Feedback"])
app.include_router(settings_router, prefix=prefix, tags=["Settings"])

import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.isdir(frontend_dist):
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        target_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(target_path):
            return FileResponse(target_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "message": f"Welcome to {settings.PROJECT_NAME} API v{settings.VERSION}",
            "docs": "/docs",
            "health": f"{prefix}/health"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
