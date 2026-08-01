from fastapi import APIRouter, Depends, Query, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.db.database import get_db
from app.models.job import JobDescription
from app.models.candidate import Candidate

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    user_id: Optional[str] = Query(None, description="Clerk user_id / Organization ID"),
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    db: Session = Depends(get_db)
):
    target_user = user_id or x_user_id or "user_admin"

    job_query = db.query(JobDescription)
    cand_query = db.query(Candidate)

    if target_user != "all":
        job_query = job_query.filter(JobDescription.created_by == target_user)
        cand_query = cand_query.filter(Candidate.created_by == target_user)

    total_jobs = job_query.count()
    total_candidates = cand_query.count()
    
    # Calculate average match score
    avg_score_result = cand_query.with_entities(func.avg(Candidate.match_score)).scalar()
    avg_match_score = round(float(avg_score_result), 1) if avg_score_result else 0.0

    # Shortlisted count
    shortlisted_count = cand_query.filter(Candidate.status == "Shortlisted").count()

    # Status distribution
    status_counts = {
        "Pending": cand_query.filter(Candidate.status == "Pending").count(),
        "Analyzed": cand_query.filter(Candidate.status == "Analyzed").count(),
        "Shortlisted": shortlisted_count,
        "Rejected": cand_query.filter(Candidate.status == "Rejected").count(),
    }

    # Recent candidates preview
    recent_candidates = cand_query.order_by(Candidate.created_at.desc()).limit(5).all()

    # Skill insights frequency
    all_candidates = cand_query.all()
    matched_skill_freq = {}
    missing_skill_freq = {}

    for c in all_candidates:
        for skill in (c.matched_skills or []):
            matched_skill_freq[skill] = matched_skill_freq.get(skill, 0) + 1
        for skill in (c.missing_skills or []):
            missing_skill_freq[skill] = missing_skill_freq.get(skill, 0) + 1

    top_matched = sorted(matched_skill_freq.items(), key=lambda x: x[1], reverse=True)[:5]
    top_missing = sorted(missing_skill_freq.items(), key=lambda x: x[1], reverse=True)[:5]

    return {
        "total_jobs": total_jobs,
        "total_candidates": total_candidates,
        "avg_match_score": avg_match_score,
        "shortlisted_count": shortlisted_count,
        "status_distribution": status_counts,
        "recent_candidates": [
            {
                "id": c.id,
                "name": c.name,
                "job_id": c.job_id,
                "match_score": c.match_score,
                "status": c.status,
                "created_at": c.created_at
            }
            for c in recent_candidates
        ],
        "top_matched_skills": [{"skill": k, "count": v} for k, v in top_matched],
        "top_missing_skills": [{"skill": k, "count": v} for k, v in top_missing]
    }
