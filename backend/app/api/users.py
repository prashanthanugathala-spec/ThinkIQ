from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.user import User
from app.schemas.user import UserSyncRequest, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/sync", response_model=UserResponse)
def sync_user(payload: UserSyncRequest, db: Session = Depends(get_db)):
    """
    Syncs Clerk signed up / logged in recruiter details to MySQL database.
    """
    user = db.query(User).filter(User.clerk_id == payload.clerk_id).first()
    
    if user:
        # Update existing user info
        user.email = payload.email
        user.first_name = payload.first_name
        user.last_name = payload.last_name
        if payload.profile_image_url:
            user.profile_image_url = payload.profile_image_url
    else:
        # Insert new user record
        user = User(
            clerk_id=payload.clerk_id,
            email=payload.email,
            first_name=payload.first_name,
            last_name=payload.last_name,
            profile_image_url=payload.profile_image_url,
            role=payload.role or "Recruiter"
        )
        db.add(user)

    db.commit()
    db.refresh(user)
    return user

@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.get("/me", response_model=UserResponse)
def get_current_user(x_user_id: Optional[str] = Header(None, alias="X-User-ID"), db: Session = Depends(get_db)):
    if not x_user_id:
        raise HTTPException(status_code=400, detail="X-User-ID header required")
    user = db.query(User).filter(User.clerk_id == x_user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found in MySQL database")
    return user
