from sqlalchemy.orm import Session
from app.models.job import JobDescription
from app.models.candidate import Candidate

def seed_initial_data(db: Session):
    """Seed initial high-quality mock jobs and candidates if database is empty."""
    if db.query(JobDescription).count() > 0:
        return  # Already seeded

    # 1. Create Job Descriptions
    job1 = JobDescription(
        title="Senior Full Stack AI Engineer",
        department="Engineering",
        description="We are seeking an exceptional Senior Full Stack AI Engineer to lead the design and deployment of generative AI interfaces and microservices. You will work with LLM toolchains, React, Python FastAPI, and high-performance vector databases.",
        required_skills=["React", "Python", "FastAPI", "TypeScript", "Google Gemini API", "Vector DBs", "Docker", "Tailwind CSS"],
        experience_level="Senior (5+ yrs)",
        location="San Francisco, CA / Remote",
        created_by="user_admin"
    )

    job2 = JobDescription(
        title="Lead Machine Learning Infrastructure Architect",
        department="AI Research & Infra",
        description="Architect high-throughput ML pipelines, distributed training clusters, and low-latency inference services across cloud environments. Responsible for model deployment, monitoring, and GPU orchestration.",
        required_skills=["Python", "PyTorch", "Kubernetes", "CUDA", "MLOps", "Distributed Computing", "Ray", "GCP"],
        experience_level="Lead / Principal",
        location="Hybrid - New York, NY",
        created_by="user_admin"
    )

    job3 = JobDescription(
        title="Principal AI Product Manager",
        department="Product Management",
        description="Drive product strategy and roadmap for enterprise AI workflow automation tools. Partner with engineering, UX design, and executive leadership to transform raw research into intuitive recruiter-facing web applications.",
        required_skills=["Product Roadmap", "AI/ML Workflows", "UX/UI Strategy", "Data Analytics", "Agile Leadership", "User Research"],
        experience_level="Senior / Principal",
        location="Remote (US)",
        created_by="user_admin"
    )

    db.add_all([job1, job2, job3])
    db.commit()

    # Refresh to get job IDs
    db.refresh(job1)
    db.refresh(job2)
    db.refresh(job3)

    # 2. Create Candidate Profiles
    candidates = [
        Candidate(
            job_id=job1.id,
            name="Alex Rivera",
            email="alex.rivera@techventure.io",
            phone="+1 (415) 892-3019",
            resume_file_path="uploads/alex_rivera_resume.pdf",
            parsed_data={
                "experience_years": 6,
                "current_company": "Apex AI Systems",
                "education": "M.S. Computer Science, Stanford University",
                "bio": "Full-stack engineer specializing in LLM integrations, reactive web UIs, and cloud microservices."
            },
            match_score=94.5,
            matched_skills=["React", "Python", "FastAPI", "TypeScript", "Google Gemini API", "Docker", "Tailwind CSS"],
            missing_skills=["Vector DBs"],
            interview_questions=[
                "Walk us through your architecture for real-time LLM streaming responses in React.",
                "How do you optimize FastAPI async endpoints under heavy concurrent request spikes?",
                "What caching strategies do you employ for prompt completions to reduce latency and cost?",
                "How do you handle client-side state synchronization when parsing complex JSON streams?",
                "Describe a situation where you had to balance feature delivery speed against code refactoring."
            ],
            ai_summary="Top-tier candidate with exceptional full-stack capability and hands-on Gemini API deployment experience. Highly recommended for immediate interview.",
            status="Shortlisted"
        ),
        Candidate(
            job_id=job1.id,
            name="Sarah Chen",
            email="sarah.chen@innovate.dev",
            phone="+1 (408) 512-9921",
            resume_file_path="uploads/sarah_chen_resume.pdf",
            parsed_data={
                "experience_years": 5,
                "current_company": "CloudPulse",
                "education": "B.S. Software Engineering, UC Berkeley",
                "bio": "Senior frontend developer transitioning to full-stack AI platform development."
            },
            match_score=88.0,
            matched_skills=["React", "TypeScript", "Tailwind CSS", "Python", "Docker"],
            missing_skills=["FastAPI", "Google Gemini API", "Vector DBs"],
            interview_questions=[
                "How do you structure component libraries for maximum reusability and performance?",
                "Explain your approach to learning Python FastAPI coming from a Node.js/Express background.",
                "What techniques do you use to prevent unnecessary component re-renders in React applications?",
                "How would you integrate an AI scoring progress indicator in a web application UI?"
            ],
            ai_summary="Strong frontend foundation with solid Python experience. Will require minor onboarding for specialized AI toolchains.",
            status="Analyzed"
        ),
        Candidate(
            job_id=job1.id,
            name="Marcus Vance",
            email="marcus.vance@vectorlabs.org",
            phone="+1 (206) 741-9082",
            resume_file_path="uploads/marcus_vance_resume.pdf",
            parsed_data={
                "experience_years": 4,
                "current_company": "DataSphere",
                "education": "B.S. Computer Science, University of Washington",
                "bio": "Backend specialist focused on Python REST APIs and database optimization."
            },
            match_score=81.5,
            matched_skills=["Python", "FastAPI", "Docker", "Vector DBs"],
            missing_skills=["React", "TypeScript", "Tailwind CSS", "Google Gemini API"],
            interview_questions=[
                "How do you design database schemas for rapid querying of unstructured AI embeddings?",
                "Can you discuss your familiarity with frontend SPA frameworks and modern state management?",
                "What is your approach to automated unit and integration testing in Python APIs?"
            ],
            ai_summary="Solid backend engineer. Demonstrates deep database knowledge, but lacks frontend React experience required for this role.",
            status="Pending"
        ),
        Candidate(
            job_id=job2.id,
            name="Elena Rostova",
            email="elena.rostova@quantumai.com",
            phone="+1 (212) 381-0044",
            resume_file_path="uploads/elena_rostova_resume.pdf",
            parsed_data={
                "experience_years": 8,
                "current_company": "DeepMind Alum / AI Scale",
                "education": "Ph.D. Machine Learning, MIT",
                "bio": "ML Infrastructure Specialist expert in PyTorch distributed training and Kubernetes GPU orchestration."
            },
            match_score=96.0,
            matched_skills=["Python", "PyTorch", "Kubernetes", "CUDA", "MLOps", "Distributed Computing", "GCP"],
            missing_skills=["Ray"],
            interview_questions=[
                "How do you minimize communication overhead in multi-node data parallel PyTorch training runs?",
                "Explain your approach to dynamic GPU allocation and autoscaling on Kubernetes clusters.",
                "How do you design fallback mechanisms for inference latency degradation during peak traffic?"
            ],
            ai_summary="World-class ML Infrastructure architect with exceptional research and production credentials. High priority candidate.",
            status="Shortlisted"
        ),
        Candidate(
            job_id=job3.id,
            name="David Kim",
            email="david.kim@productlabs.co",
            phone="+1 (312) 609-4411",
            resume_file_path="uploads/david_kim_resume.pdf",
            parsed_data={
                "experience_years": 7,
                "current_company": "Meta Product Group",
                "education": "MBA Northwestern Kellogg / B.S. CS Michigan",
                "bio": "Product leader specialized in human-in-the-loop AI interfaces and recruitment workflows."
            },
            match_score=91.0,
            matched_skills=["Product Roadmap", "AI/ML Workflows", "UX/UI Strategy", "Data Analytics", "Agile Leadership"],
            missing_skills=["User Research"],
            interview_questions=[
                "How do you prioritize feature requests when building products for specialized B2B recruiter personas?",
                "Can you describe an instance where user feedback altered your AI product roadmap?",
                "How do you define and track core success metrics for AI match scoring tools?"
            ],
            ai_summary="Highly strategic product manager with deep understanding of recruiter workflows and modern design standards.",
            status="Shortlisted"
        )
    ]

    db.add_all(candidates)
    db.commit()
    print("Successfully seeded TalentIQ database with realistic mock jobs and candidates!")
