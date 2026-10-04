from app.core.database import get_db

# Re-export get_db for route handlers
__all__ = ["get_db"]
