import os
import shutil
import re
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, Header, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.job import JobDescription
from app.models.candidate import Candidate
from app.schemas.candidate import CandidateResponse, CandidateStatusUpdate, CandidateComparisonRequest
from app.services.resume_parser import extract_text_from_file
from app.services.ai_service import analyze_resume_against_job
from app.services.email_service import send_candidate_status_email

router = APIRouter(prefix="/candidates", tags=["Candidates"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def derive_name_from_filename(filename: str) -> str:
    """Derives a formatted candidate name from a filename if resume text name is missing."""
    clean_name = os.path.splitext(filename)[0]
    # Remove job_id prefix if present
    clean_name = re.sub(r'^\d+_', '', clean_name)
    # Replace underscores/hyphens with spaces
    clean_name = clean_name.replace('_', ' ').replace('-', ' ')
    # Remove common words like resume, cv, profile
    clean_name = re.sub(r'\b(resume|cv|profile|pdf|doc|docx)\b', '', clean_name, flags=re.IGNORECASE).strip()
    if clean_name:
        return ' '.join(word.capitalize() for word in clean_name.split())
    return "Candidate Professional"

@router.get("/", response_model=List[CandidateResponse])
def get_candidates(
    job_id: Optional[int] = None,
    user_id: Optional[str] = Query(None, description="Clerk user_id / Organization ID"),
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    db: Session = Depends(get_db)
):
    target_user = user_id or x_user_id or "user_admin"
    query = db.query(Candidate)
    
    if target_user != "all":
        query = query.filter(Candidate.created_by == target_user)
        
    if job_id:
        query = query.filter(Candidate.job_id == job_id)
        
    return query.order_by(Candidate.created_at.desc()).all()

@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

@router.post("/upload", response_model=CandidateResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    job_id: int = Form(...),
    name: Optional[str] = Form(None),
    email: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None),
    x_user_id: Optional[str] = Header(None, alias="X-User-ID"),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    target_user = user_id or x_user_id or "user_admin"
    
    # Verify Job
    job = db.query(JobDescription).filter(JobDescription.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job Description not found")

    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract Text
    resume_text = extract_text_from_file(file_path)
    if not resume_text:
        resume_text = f"Resume submitted for candidate {name or file.filename} applying for {job.title}."

    # Run AI Analysis
    ai_result = analyze_resume_against_job(
        resume_text=resume_text,
        job_title=job.title,
        job_description=job.description,
        required_skills=job.required_skills or []
    )

    # 1. Determine Candidate Name (Form Input > Extracted AI Name > Filename > Default)
    if name and name.strip():
        candidate_name = name.strip()
    else:
        ai_extracted_name = ai_result.get("candidate_name", "").strip()
        # Filter out generic AI placeholder names
        generic_placeholders = ["full candidate name", "john doe", "candidate professional", "candidate name", "jane doe"]
        if ai_extracted_name and ai_extracted_name.lower() not in generic_placeholders:
            candidate_name = ai_extracted_name
        else:
            candidate_name = derive_name_from_filename(file.filename)

    # 2. Determine Candidate Email
    if email and email.strip():
        candidate_email = email.strip()
    else:
        ai_extracted_email = ai_result.get("email", "").strip()
        if ai_extracted_email and "example.com" not in ai_extracted_email.lower():
            candidate_email = ai_extracted_email
        else:
            candidate_email = "candidate@enterprise.com"

    candidate_phone = ai_result.get("phone", "+1 (555) 000-0000")
    match_score = float(ai_result.get("match_score", 75.0))

    # Sync candidate name and email back into ai_result dictionary
    ai_result["candidate_name"] = candidate_name
    ai_result["email"] = candidate_email

    # Auto-Shortlist if match score >= 85%
    initial_status = "Shortlisted" if match_score >= 85.0 else "Analyzed"

    new_candidate = Candidate(
        job_id=job.id,
        name=candidate_name,
        email=candidate_email,
        phone=candidate_phone,
        resume_file_path=file_path,
        parsed_data=ai_result,
        match_score=match_score,
        matched_skills=ai_result.get("matched_skills", []),
        missing_skills=ai_result.get("missing_skills", []),
        interview_questions=ai_result.get("interview_questions", []),
        ai_summary=ai_result.get("ai_summary", "Evaluation completed."),
        status=initial_status,
        created_by=target_user
    )

    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    # Trigger Qualification Email if Shortlisted
    if candidate_email and initial_status == "Shortlisted":
        send_candidate_status_email(candidate_email, candidate_name, job.title, "Shortlisted")

    return new_candidate

@router.put("/{candidate_id}/status", response_model=CandidateResponse)
def update_candidate_status(
    candidate_id: int,
    status_in: CandidateStatusUpdate,
    db: Session = Depends(get_db)
):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    old_status = candidate.status
    candidate.status = status_in.status
    db.commit()
    db.refresh(candidate)

    # Dispatch email alert if status changes or when shortlisted
    if candidate.email and old_status != status_in.status:
        job = db.query(JobDescription).filter(JobDescription.id == candidate.job_id).first()
        job_title = job.title if job else "Selected Role"
        send_candidate_status_email(candidate.email, candidate.name, job_title, status_in.status)

    return candidate

@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    
    # Clean up uploaded resume file if exists
    if candidate.resume_file_path and os.path.exists(candidate.resume_file_path):
        try:
            os.remove(candidate.resume_file_path)
        except Exception as e:
            print(f"Notice cleaning up resume file: {e}")

    db.delete(candidate)
    db.commit()
    return None

@router.post("/compare", response_model=List[CandidateResponse])
def compare_candidates(payload: CandidateComparisonRequest, db: Session = Depends(get_db)):
    candidates = db.query(Candidate).filter(Candidate.id.in_(payload.candidate_ids)).all()
    return candidates
