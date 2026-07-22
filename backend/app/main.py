from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routes import analyze, history

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-powered Digital Trust and Cybersecurity Platform",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://truth-engine.vercel.app",  # Production placeholder
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(analyze.router, prefix=settings.API_V1_STR)
app.include_router(history.router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "api_version": "v1",
        "mock_mode": {
            "gemini": settings.is_mock_gemini,
            "virustotal": settings.is_mock_virustotal,
            "safebrowsing": settings.is_mock_safebrowsing,
            "mongodb": settings.is_mock_mongodb
        }
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}
