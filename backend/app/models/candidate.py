from sqlalchemy import Column, Integer, String, Float, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    job_id = Column(Integer, ForeignKey("job_descriptions.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    resume_file_path = Column(String(500), nullable=True)
    parsed_data = Column(JSON, nullable=True, default=dict)  # Full profile details
    match_score = Column(Float, nullable=False, default=0.0) # 0 to 100
    matched_skills = Column(JSON, nullable=True, default=list) # List of skills present
    missing_skills = Column(JSON, nullable=True, default=list) # List of missing skills
    interview_questions = Column(JSON, nullable=True, default=list) # Generated questions
    ai_summary = Column(String(1000), nullable=True) # Concise AI verdict
    status = Column(String(50), nullable=False, default="Analyzed") # Pending, Analyzed, Shortlisted, Rejected
    created_by = Column(String(255), nullable=True, default="user_admin", index=True) # Clerk user_id / Organization ID
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
