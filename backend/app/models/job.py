from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from app.db.database import Base

class JobDescription(Base):
    __tablename__ = "job_descriptions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False, index=True)
    department = Column(String(100), nullable=True, default="Engineering")
    description = Column(Text, nullable=False)
    required_skills = Column(JSON, nullable=False, default=list)  # List of strings
    experience_level = Column(String(50), nullable=False, default="Mid-Senior")
    location = Column(String(255), nullable=True, default="Remote / Hybrid")
    created_by = Column(String(255), nullable=True, default="user_admin")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
