import logging
import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from backend.app.config import settings
from backend.app.models.schemas import AnalysisResult

logger = logging.getLogger("uvicorn")

# In-memory fallback database path
FALLBACK_DB_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")
FALLBACK_DB_PATH = os.path.join(FALLBACK_DB_DIR, "history.json")

class Database:
    def __init__(self):
        self.client: Optional[AsyncIOMotorClient] = None
        self.db = None
        self.use_fallback = True
        
        if settings.MONGODB_URI:
            try:
                self.client = AsyncIOMotorClient(settings.MONGODB_URI, serverSelectionTimeoutMS=2000)
                self.db = self.client[settings.DATABASE_NAME]
                self.use_fallback = False
                logger.info("MongoDB client connected successfully.")
            except Exception as e:
                logger.error(f"MongoDB connection failed: {e}. Falling back to local storage.")
                self.use_fallback = True
        else:
            logger.info("No MONGODB_URI configured. Running in Local Storage Mode.")
            
        if self.use_fallback:
            os.makedirs(FALLBACK_DB_DIR, exist_ok=True)
            if not os.path.exists(FALLBACK_DB_PATH):
                with open(FALLBACK_DB_PATH, "w") as f:
                    json.dump([], f)
                    
    async def get_history(self, user_id: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """
        Retrieves scan history items.
        """
        if not self.use_fallback and self.db is not None:
            try:
                query = {}
                if user_id:
                    query["user_id"] = user_id
                cursor = self.db.scans.find(query).sort("created_at", -1).limit(limit)
                scans = []
                async for document in cursor:
                    # Clean up _id Mongo object
                    document["id"] = str(document.pop("_id")) if "_id" in document else document.get("scan_id")
                    scans.append(document)
                return scans
            except Exception as e:
                logger.error(f"MongoDB fetch history failed: {e}. Reading fallback DB.")
                
        # Read from fallback JSON
        try:
            with open(FALLBACK_DB_PATH, "r") as f:
                scans = json.load(f)
            if user_id:
                scans = [s for s in scans if s.get("user_id") == user_id]
            scans.sort(key=lambda s: s.get("created_at", ""), reverse=True)
            return scans[:limit]
        except Exception as e:
            logger.error(f"Failed to read local fallback database: {e}")
            return []
            
    async def save_scan(self, scan_result: AnalysisResult) -> bool:
        """
        Saves a scan result.
        """
        scan_dict = scan_result.dict()
        
        if not self.use_fallback and self.db is not None:
            try:
                # Set custom _id
                scan_dict["_id"] = scan_result.scan_id
                await self.db.scans.insert_one(scan_dict)
                return True
            except Exception as e:
                logger.error(f"MongoDB save scan failed: {e}. Saving to fallback DB.")
                
        # Save to fallback JSON
        try:
            with open(FALLBACK_DB_PATH, "r") as f:
                scans = json.load(f)
            scans.append(scan_dict)
            with open(FALLBACK_DB_PATH, "w") as f:
                json.dump(scans, f, indent=2)
            return True
        except Exception as e:
            logger.error(f"Failed to save to local fallback database: {e}")
            return False

    async def get_scan(self, scan_id: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves a single scan by ID.
        """
        if not self.use_fallback and self.db is not None:
            try:
                document = await self.db.scans.find_one({"scan_id": scan_id})
                if document:
                    document["id"] = str(document.pop("_id")) if "_id" in document else document.get("scan_id")
                    return document
            except Exception as e:
                logger.error(f"MongoDB scan fetch failed: {e}.")
                
        # Fallback search
        try:
            with open(FALLBACK_DB_PATH, "r") as f:
                scans = json.load(f)
            for scan in scans:
                if scan.get("scan_id") == scan_id:
                    return scan
        except Exception as e:
            logger.error(f"Failed to read scan from fallback database: {e}")
            
        return None

db_helper = Database()
