from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

class CandidateBase(BaseModel):
    job_id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None

class CandidateCreate(CandidateBase):
    created_by: Optional[str] = "user_admin"

class CandidateStatusUpdate(BaseModel):
    status: str  # Pending, Analyzed, Shortlisted, Rejected

class CandidateComparisonRequest(BaseModel):
    candidate_ids: List[int]
    created_by: Optional[str] = None

class CandidateResponse(CandidateBase):
    id: int
    resume_file_path: Optional[str] = None
    parsed_data: Optional[Dict[str, Any]] = None
    match_score: float
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    interview_questions: List[str] = []
    ai_summary: Optional[str] = None
    status: str
    created_by: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
