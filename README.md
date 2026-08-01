# 🚀 TalentIQ AI — Enterprise Candidate Screening & Assessment Platform

![TalentIQ AI Apple Light Interface](https://img.shields.io/badge/Design-Apple%20White%20Light%20Mode-0071e3)
![FastAPI Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python-009688)
![MySQL Database](https://img.shields.io/badge/Database-MySQL-4479A1)
![React Vite](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB)
![Clerk Auth](https://img.shields.io/badge/Auth-Clerk%20JWT-6C47FF)
![Generative AI](https://img.shields.io/badge/AI-Groq%20%2F%20Gemini%201.5-FF6F00)
![Resend Email](https://img.shields.io/badge/Email-Resend%20API-black)

**TalentIQ AI** is an enterprise-grade AI Candidate Assessment Platform designed exclusively for recruiters and talent acquisition teams. Built with an **Apple Light Mode glassmorphism design system**, it automates candidate resume parsing, calculates objective **0–100% skill match scores**, extracts missing competency gaps, generates tailored interview questions, and dispatches automated shortlist qualification emails via Resend.

---

## 🌟 Key Features

1. **🎨 Apple White Design System**: Pristine light mode glassmorphism (`bg-slate-50`, `#0071e3` Apple Blue CTAs, rounded card corners, and smooth entrance scroll animations).
2. **🤖 Generative AI Assessment Engine**: Integrates LLM API endpoints (Groq / Google Gemini 1.5 Pro) to analyze candidate resume PDFs against target Job Descriptions.
3. **📊 Recruiter Intelligence Dashboard**: Real-time stats, Chart.js doughnut funnel charts, skill frequency bar graphs, and recent candidate feed.
4. **🏢 Multi-Tenant Organization Data Isolation**: Every recruiter starts with an isolated workspace (`created_by == user_id`) and clean slate empty state UI.
5. **✏️ Job Description Management & Editing**: Full creation, editing (`PUT /api/jobs/{id}`), and deletion of active openings.
6. **📧 Automated Resend Qualification Emails**: Dispatches custom HTML qualification emails when candidates are marked or auto-qualified as **Shortlisted**.
7. **🗑️ Candidate Application Removal**: Delete candidate profiles and PDF resumes cleanly from MySQL and local storage.
8. **🔍 Optimized Global Search Engine (`⌘K` / `Ctrl+K`)**: Instant real-time fuzzy search across candidates and job roles with dropdown modal.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS, `@clerk/clerk-react`, Chart.js, Lucide Icons
- **Backend**: Python FastAPI, Uvicorn, SQLAlchemy ORM, PyMySQL, PyPDF2
- **Database**: MySQL (`talentiq` database)
- **AI / LLM Integration**: Groq Llama 3.3 70B / Google Gemini 1.5 Pro
- **Email Dispatch**: Resend Email API

---

## 🚀 Quickstart Installation & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- MySQL Server (running on `localhost:3306`)

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Update credentials in .env (MYSQL_USER, MYSQL_PASSWORD, GEMINI_API_KEY, RESEND_API_KEY)

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
# Update VITE_CLERK_PUBLISHABLE_KEY in .env.local

npm run dev -- --host 127.0.0.1 --port 3000
```

---

## 📁 Repository Structure

```
TalentIQ-AI/
├── backend/
│   ├── app/
│   │   ├── api/          # FastAPI Routes (jobs, candidates, dashboard, users)
│   │   ├── core/         # Configuration & Settings
│   │   ├── db/           # Database Connection & Seed Engine
│   │   ├── models/       # SQLAlchemy ORM Models (Job, Candidate, User)
│   │   ├── schemas/      # Pydantic Request/Response Models
│   │   ├── services/     # AI Evaluation, Resume Parser, Resend Email
│   │   └── main.py       # FastAPI Entrypoint
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/   # Common GlassCards, ScoreGauge, Navbar, Sidebar
│   │   ├── pages/        # Landing, Dashboard, Jobs, UploadResume, Analysis, Candidates, Compare
│   │   ├── services/     # Axios API Client & User Scoping
│   │   └── styles/       # Apple Light CSS Design System & Keyframe Animations
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── .gitignore
└── README.md
```
