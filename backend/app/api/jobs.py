from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.job import JobDescription
from app.schemas.job import JobCreate, JobUpdate, JobResponse

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("/", response_model=List[JobResponse])
def get_jobs(
    user_id: Optional[str] = Query(None, description="Clerk user_id / Organization ID"),
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    target_user = user_id or x_user_id or "user_admin"
    query = db.query(JobDescription)
    
    # Filter by user organization scope
    if target_user != "all":
        query = query.filter(JobDescription.created_by == target_user)
        
    jobs = query.order_by(JobDescription.created_at.desc()).offset(skip).limit(limit).all()
    return jobs

@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    job_in: JobCreate,
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    db: Session = Depends(get_db)
):
    job_data = job_in.model_dump()
    if x_user_id and x_user_id != "undefined":
        job_data["created_by"] = x_user_id
        
    new_job = JobDescription(**job_data)
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return new_job

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job Description not found")
    return job

@router.put("/{job_id}", response_model=JobResponse)
def update_job(job_id: int, job_in: JobUpdate, db: Session = Depends(get_db)):
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job Description not found")
    
    update_data = job_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)
        
    db.commit()
    db.refresh(job)
    return job

@router.delete("/{job_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job Description not found")
    db.delete(job)
    db.commit()
    return None
