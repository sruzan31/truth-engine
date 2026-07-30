try:
    from app.routes.analyze import router as analyze
    from app.routes.history import router as history
except ImportError:
    from app.routes.analyze import router as analyze
    from app.routes.history import router as history

