try:
    from app.routes.analyze import router as analyze
    from app.routes.history import router as history
    from app.routes.auth import router as auth
except ImportError:
    from app.routes.analyze import router as analyze
    from app.routes.history import router as history
    from app.routes.auth import router as auth
