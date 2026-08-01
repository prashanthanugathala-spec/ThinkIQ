from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.db.database import engine, Base, SessionLocal
from app.db.seed_data import seed_initial_data
from app.api.jobs import router as jobs_router
from app.api.candidates import router as candidates_router
from app.api.dashboard import router as dashboard_router
from app.api.users import router as users_router

# Create Database tables
Base.metadata.create_all(bind=engine)

# Seed database with initial mock data
db = SessionLocal()
try:
    seed_initial_data(db)
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="TalentIQ AI - Next Generation AI Candidate Screening API"
)

# CORS Middleware Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded resumes statically
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include Routers
app.include_router(jobs_router, prefix=settings.API_V1_STR)
app.include_router(candidates_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "TalentIQ AI API is operational",
        "version": settings.VERSION,
        "docs": "/docs"
    }
