import React from 'react';
import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, Sparkles, ArrowRight, ChevronRight, Lock, 
  Award, FileText, CheckCircle2, Users, ShieldCheck, 
  Mail, BarChart3, Layers, Zap, Clock, Search
} from 'lucide-react';

export const Landing = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const handleEnterDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white relative overflow-x-hidden">
      {/* Background Soft Glows (Apple White Animated Glows) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-sky-100/70 via-blue-50/50 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-[1200px] right-0 w-[800px] h-[500px] bg-gradient-to-b from-indigo-100/40 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Apple Glass Navigation Bar */}
      <header className="sticky top-0 z-50 apple-glass-nav px-8 py-4 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">
              TalentIQ AI
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/60 shadow-xs">
              Recruiter OS v1.1
            </span>
          </div>
        </div>

        {/* Recruiter Auth Action */}
        <div className="flex items-center space-x-4">
          {isSignedIn ? (
            <button
              onClick={handleEnterDashboard}
              className="apple-btn-primary flex items-center space-x-2 px-6 py-2.5 rounded-full font-semibold text-xs shadow-md"
            >
              <span>Recruiter Dashboard ({user?.firstName || 'Logged In'})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <SignInButton mode="modal">
                <button className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 shadow-sm transition-all hover:scale-105">
                  Recruiter Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="apple-btn-primary px-6 py-2.5 rounded-full font-semibold text-xs shadow-md">
                  Create Account
                </button>
              </SignUpButton>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION WITH ANIMATED ENTRANCE */}
        <section className="px-6 pt-16 pb-20 text-center max-w-5xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-xs text-blue-700 font-semibold shadow-xs animate-float">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin-slow" />
            <span>Designed Exclusively for Enterprise Recruiters & Talent Acquisition</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12] animate-fade-in-up">
            Screen Resumes with Precision. <br />
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Automated by Generative AI.
            </span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Upload Job Descriptions and candidate PDF resumes. Get instant match scores, missing skill gap analysis, and tailored interview questions in seconds.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {isSignedIn ? (
              <button
                onClick={handleEnterDashboard}
                className="apple-btn-primary px-8 py-4 rounded-full font-bold text-sm shadow-xl flex items-center space-x-2 group"
              >
                <span>Launch Recruiter Platform</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="apple-btn-primary px-8 py-4 rounded-full font-bold text-sm shadow-xl flex items-center space-x-2 group">
                    <Lock className="w-4 h-4" />
                    <span>Sign In with Recruiter Credentials</span>
                  </button>
                </SignInButton>

                <button
                  onClick={handleEnterDashboard}
                  className="px-8 py-4 rounded-full bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm transition-all hover:scale-105 flex items-center space-x-2 group"
                >
                  <span>Explore Interactive Demo</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Apple-Style Mock Dashboard Preview Card (Floating & Hover Scale) */}
          <div className="pt-10 max-w-4xl mx-auto animate-scale-up" style={{ animationDelay: '0.45s' }}>
            <div className="p-3 bg-slate-900/5 rounded-3xl border border-slate-200 shadow-2xl backdrop-blur-xl hover:scale-[1.01] transition-transform duration-500">
              <div className="bg-slate-950 rounded-2xl p-6 md:p-8 text-left text-white shadow-inner space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-slate-400 font-mono pl-2">TalentIQ Recruiter OS — Candidate Assessment Matrix</span>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                    Live Match Score: 94.5%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Candidate</span>
                    <h4 className="font-bold text-sm text-white">Alex Rivera</h4>
                    <p className="text-slate-400 text-[11px]">Senior Full Stack AI Engineer</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Matched Skills (7)</span>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">React</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Python</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">FastAPI</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Gemini API</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">Missing Skill (1)</span>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">Vector DBs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS & VALUE PROPOSITION (HOVER SCALE ANIMATION) */}
        <section className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-200/80">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1 hover:scale-105 hover:shadow-md transition-all duration-300">
              <p className="text-3xl font-extrabold text-blue-600">95%</p>
              <p className="text-xs font-bold text-slate-700">Faster Screening</p>
              <p className="text-[11px] text-slate-400">Instant resume parsing</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1 hover:scale-105 hover:shadow-md transition-all duration-300">
              <p className="text-3xl font-extrabold text-blue-600">0–100%</p>
              <p className="text-xs font-bold text-slate-700">Match Scoring</p>
              <p className="text-[11px] text-slate-400">Objective AI algorithm</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1 hover:scale-105 hover:shadow-md transition-all duration-300">
              <p className="text-3xl font-extrabold text-blue-600">100%</p>
              <p className="text-xs font-bold text-slate-700">Data Isolation</p>
              <p className="text-[11px] text-slate-400">User & org scoped</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-1 hover:scale-105 hover:shadow-md transition-all duration-300">
              <p className="text-3xl font-extrabold text-blue-600">Resend</p>
              <p className="text-xs font-bold text-slate-700">Auto Notifications</p>
              <p className="text-[11px] text-slate-400">Instant shortlist emails</p>
            </div>
          </div>
        </section>

        {/* CORE PLATFORM CAPABILITIES GRID (HOVER LIFT ANIMATIONS) */}
        <section className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">Platform Capabilities</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Everything Enterprise Recruiters Need
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Eliminate manual resume reading and conduct data-driven candidate evaluations effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="apple-card p-6 rounded-3xl space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Automated 0–100% Scoring</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Objective calculation comparing candidate qualifications against target job requirements without bias.
              </p>
            </div>

            <div className="apple-card p-6 rounded-3xl space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Skill Gap Analysis</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Identifies matched competencies and highlights missing or unverified skill requirements instantly.
              </p>
            </div>

            <div className="apple-card p-6 rounded-3xl space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Tailored Questions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates 5–10 personalized technical and scenario questions based on candidate resume gaps.
              </p>
            </div>

            <div className="apple-card p-6 rounded-3xl space-y-4 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Resend Email Alerts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically notifies shortlisted candidates via Resend API when qualified for technical interviews.
              </p>
            </div>
          </div>
        </section>

        {/* END-TO-END RECRUITER JOURNEY */}
        <section className="py-20 px-6 max-w-6xl mx-auto border-t border-slate-200/80">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">Seamless Workflow</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              How TalentIQ AI Works in 4 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="apple-card p-6 rounded-3xl space-y-3 relative group">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs group-hover:scale-110 transition-transform">1</span>
              <h4 className="font-bold text-sm text-slate-900">Create Job Description</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Define job title, required skill sets, and department parameters.</p>
            </div>

            <div className="apple-card p-6 rounded-3xl space-y-3 relative group">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs group-hover:scale-110 transition-transform">2</span>
              <h4 className="font-bold text-sm text-slate-900">Upload PDF Resumes</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Drag and drop applicant resumes into the AI Resume Studio.</p>
            </div>

            <div className="apple-card p-6 rounded-3xl space-y-3 relative group">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs group-hover:scale-110 transition-transform">3</span>
              <h4 className="font-bold text-sm text-slate-900">Review AI Insights</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Inspect circular score ring gauges, skill chips, and copy interview questions.</p>
            </div>

            <div className="apple-card p-6 rounded-3xl space-y-3 relative group">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs group-hover:scale-110 transition-transform">4</span>
              <h4 className="font-bold text-sm text-slate-900">Shortlist & Auto-Notify</h4>
              <p className="text-xs text-slate-500 leading-relaxed">Update candidate status to Shortlisted and trigger automated qualification emails.</p>
            </div>
          </div>
        </section>

        {/* CANDIDATE MATRIX COMPARISON PREVIEW */}
        <section className="py-20 px-6 max-w-5xl mx-auto border-t border-slate-200/80">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-800 space-y-8 hover:border-slate-700 transition-colors">
            <div className="max-w-xl space-y-3">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 animate-pulse">
                Candidate Comparison Matrix
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Compare Top Candidates Side-by-Side
              </h3>
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                Select multiple applicants to evaluate their relative match scores, skill coverage, and interview readiness simultaneously in a clean comparison table.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              {isSignedIn ? (
                <button
                  onClick={handleEnterDashboard}
                  className="apple-btn-primary px-8 py-3.5 rounded-full font-bold text-xs shadow-lg inline-flex items-center space-x-2"
                >
                  <span>Open Candidate Matrix</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <SignInButton mode="modal">
                  <button className="apple-btn-primary px-8 py-3.5 rounded-full font-bold text-xs shadow-lg inline-flex items-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Sign In to Access Matrix</span>
                  </button>
                </SignInButton>
              )}
            </div>
          </div>
        </section>

        {/* FINAL CALL TO ACTION */}
        <section className="py-24 px-6 max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Ready to Upgrade Your Hiring Workflow?
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto leading-relaxed">
            Start creating job descriptions and screening candidate resumes with generative AI precision today.
          </p>

          <div className="pt-4">
            {isSignedIn ? (
              <button
                onClick={handleEnterDashboard}
                className="apple-btn-primary px-10 py-4 rounded-full font-extrabold text-sm shadow-xl inline-flex items-center space-x-2 group"
              >
                <span>Launch Recruiter Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button className="apple-btn-primary px-10 py-4 rounded-full font-extrabold text-sm shadow-xl inline-flex items-center space-x-2 group">
                  <span>Create Recruiter Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </SignUpButton>
            )}
          </div>
        </section>
      </main>

      {/* Minimalist Apple Footer */}
      <footer className="apple-glass-nav py-8 text-center text-xs text-slate-500 border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800">TalentIQ AI</span>
            <span>© 2026</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Enterprise Recruiter Platform — Product & Technical Requirements Document Compliant
          </p>
        </div>
      </footer>
    </div>
  );
};
