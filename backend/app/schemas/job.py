from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class JobBase(BaseModel):
    title: str
    department: Optional[str] = "Engineering"
    description: str
    required_skills: List[str] = []
    experience_level: str = "Mid-Senior"
    location: Optional[str] = "Remote / Hybrid"

class JobCreate(JobBase):
    created_by: Optional[str] = "user_admin"

class JobUpdate(BaseModel):
    title: Optional[str] = None
    department: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    experience_level: Optional[str] = None
    location: Optional[str] = None

class JobResponse(JobBase):
    id: int
    created_by: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
