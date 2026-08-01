import React from 'react';
import { SignInButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export const Login = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  if (isSignedIn) {
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Main Glass Card Container */}
      <div className="max-w-md w-full glass-panel p-8 md:p-10 rounded-3xl border border-slate-700/80 shadow-2xl text-center space-y-8 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-glow-blue">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-sky-400 bg-clip-text text-transparent">
              TalentIQ AI
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Next-Generation Recruiter Assessment Platform
            </p>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3 text-xs text-slate-300 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <Sparkles className="w-4 h-4 text-sky-400 flex-shrink-0" />
            <span>Google Gemini 1.5 automated resume scoring</span>
          </div>
          <div className="flex items-center space-x-3 text-xs text-slate-300 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Clerk JWT secure recruiter authentication</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <SignInButton mode="modal">
            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 hover:from-sky-400 hover:to-purple-500 text-white font-bold text-sm shadow-glow-blue transition-all flex items-center justify-center space-x-2">
              <span>Sign In with Clerk</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </SignInButton>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-colors"
          >
            Instant Demo Access
          </button>
        </div>
      </div>
    </div>
  );
};
