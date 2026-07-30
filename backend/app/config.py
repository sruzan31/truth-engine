import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    PROJECT_NAME: str = "The Truth Engine"
    API_V1_STR: str = "/api/v1"
    
    # Third-Party API Keys
    GEMINI_API_KEY: str = Field(default="", env="GEMINI_API_KEY")
    VIRUSTOTAL_API_KEY: str = Field(default="", env="VIRUSTOTAL_API_KEY")
    SAFE_BROWSING_API_KEY: str = Field(default="", env="SAFE_BROWSING_API_KEY")
    
    # Database Settings
    MONGODB_URI: str = Field(default="", env="MONGODB_URI")
    DATABASE_NAME: str = Field(default="truth_engine", env="DATABASE_NAME")

    # JWT Settings
    JWT_SECRET_KEY: str = Field(default="change_this_secret_in_production", env="JWT_SECRET_KEY")
    JWT_ALGORITHM: str = Field(default="HS256", env="JWT_ALGORITHM")
    JWT_EXPIRES_MINUTES: int = Field(default=60 * 24 * 30, env="JWT_EXPIRES_MINUTES")
    APP_ENV: str = Field(default="development", env="APP_ENV")

    # Allowed CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://truth-engine.vercel.app",
    ]

    # File Upload Limits
    MAX_IMAGE_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB
    MAX_AUDIO_SIZE_BYTES: int = 25 * 1024 * 1024  # 25 MB
    MAX_PDF_SIZE_BYTES: int = 50 * 1024 * 1024    # 50 MB

    @property
    def is_mock_gemini(self) -> bool:
        return not bool(self.GEMINI_API_KEY and self.GEMINI_API_KEY.strip())
        
    @property
    def is_mock_virustotal(self) -> bool:
        return not bool(self.VIRUSTOTAL_API_KEY and self.VIRUSTOTAL_API_KEY.strip())

    @property
    def is_mock_safebrowsing(self) -> bool:
        return not bool(self.SAFE_BROWSING_API_KEY and self.SAFE_BROWSING_API_KEY.strip())

    @property
    def is_mock_mongodb(self) -> bool:
        return not bool(self.MONGODB_URI and self.MONGODB_URI.strip())

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()
