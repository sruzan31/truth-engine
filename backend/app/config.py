import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

class Settings:
    PROJECT_NAME: str = "The Truth Engine"
    API_V1_STR: str = "/api/v1"
    
    # API Keys & Configurations
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    VIRUSTOTAL_API_KEY: str = os.getenv("VIRUSTOTAL_API_KEY", "")
    SAFE_BROWSING_API_KEY: str = os.getenv("SAFE_BROWSING_API_KEY", "")
    
    # MongoDB Atlas Connection
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "truth_engine")
    
    # Firebase
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "")
    
    # Application Mode
    @property
    def is_mock_gemini(self) -> bool:
        return not self.GEMINI_API_KEY
        
    @property
    def is_mock_virustotal(self) -> bool:
        return not self.VIRUSTOTAL_API_KEY

    @property
    def is_mock_safebrowsing(self) -> bool:
        return not self.SAFE_BROWSING_API_KEY

    @property
    def is_mock_mongodb(self) -> bool:
        return not self.MONGODB_URI

settings = Settings()
