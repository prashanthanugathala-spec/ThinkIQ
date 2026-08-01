from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserSyncRequest(BaseModel):
    clerk_id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image_url: Optional[str] = None
    role: Optional[str] = "Recruiter"

class UserResponse(BaseModel):
    id: int
    clerk_id: str
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image_url: Optional[str] = None
    role: str
    created_at: datetime

    class Config:
        from_attributes = True
