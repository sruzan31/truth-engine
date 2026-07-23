import logging
from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from app.utils.db import db_helper

logger = logging.getLogger("uvicorn")
router = APIRouter(tags=["History & Dashboard"])

@router.get("/history", response_model=List[Dict[str, Any]])
async def get_history(user_id: Optional[str] = Query(None, description="Filter history by user ID")):
    try:
        scans = await db_helper.get_history(user_id=user_id)
        return scans
    except Exception as e:
        logger.error(f"Error fetching scans history: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{scan_id}", response_model=Dict[str, Any])
async def get_scan_report(scan_id: str):
    try:
        scan = await db_helper.get_scan(scan_id)
        if not scan:
            raise HTTPException(status_code=404, detail="Scan report not found")
        return scan
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching scan report {scan_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboard/stats", response_model=Dict[str, Any])
async def get_dashboard_stats(user_id: Optional[str] = Query(None, description="Get stats for user")):
    try:
        scans = await db_helper.get_history(user_id=user_id, limit=200)
        
        total_scans = len(scans)
        if total_scans == 0:
            return {
                "total_scans": 0,
                "average_trust_score": 0.0,
                "risk_breakdown": {"low": 0, "medium": 0, "high": 0, "critical": 0},
                "type_breakdown": {"url": 0, "email": 0, "text": 0, "image": 0, "qr": 0, "pdf": 0},
                "recent_trends": []
            }
            
        sum_scores = sum(scan.get("trust_score", 50.0) for scan in scans)
        avg_score = round(sum_scores / total_scans, 1)
        
        # Risk breakdown
        risk_counts = {"low": 0, "medium": 0, "high": 0, "critical": 0}
        # Type breakdown
        type_counts = {"url": 0, "email": 0, "text": 0, "image": 0, "qr": 0, "pdf": 0}
        
        for scan in scans:
            risk = scan.get("risk_level", "medium").lower()
            if risk in risk_counts:
                risk_counts[risk] += 1
            else:
                risk_counts["medium"] += 1
                
            stype = scan.get("scan_type", "text").lower()
            if stype in type_counts:
                type_counts[stype] += 1
                
        # Recent trends (chronological order for line charts: oldest first)
        recent_trends = []
        for scan in sorted(scans[:15], key=lambda x: x.get("created_at", "")):
            recent_trends.append({
                "date": scan.get("created_at", "")[:10], # YYYY-MM-DD
                "score": scan.get("trust_score", 50.0),
                "type": scan.get("scan_type", "text")
            })
            
        return {
            "total_scans": total_scans,
            "average_trust_score": avg_score,
            "risk_breakdown": risk_counts,
            "type_breakdown": type_counts,
            "recent_trends": recent_trends
        }
    except Exception as e:
        logger.error(f"Error generating dashboard stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
