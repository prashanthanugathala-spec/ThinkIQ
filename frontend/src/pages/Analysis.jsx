import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { fetchCandidateById, updateCandidateStatus } from '../services/api';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, MessageSquare, Columns, Copy, Check } from 'lucide-react';

export const Analysis = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCandidateById(id)
        .then((data) => {
          setCandidate(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const updated = await updateCandidateStatus(candidate.id, newStatus);
      setCandidate(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-20 text-slate-500">
        <p>Candidate report not found.</p>
        <Link to="/candidates" className="text-blue-600 font-bold text-xs mt-2 inline-block">
          Return to directory
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6 md:p-8">
      {/* Back Link & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/candidates"
          className="flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Candidate Directory</span>
        </Link>
        <div className="flex items-center space-x-3">
          <Link
            to={`/compare?candidate_id=${candidate.id}`}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Add to Compare</span>
          </Link>
        </div>
      </div>

      {/* Hero Header Card */}
      <GlassCard glow={true} className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {candidate.status}
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{candidate.name}</h1>
          <p className="text-xs text-slate-500 font-medium flex flex-wrap items-center justify-center md:justify-start gap-4">
            <span>Email: {candidate.email || 'N/A'}</span>
            <span>Phone: {candidate.phone || 'N/A'}</span>
          </p>
        </div>

        {/* Circular Score Ring */}
        <div className="flex flex-col items-center">
          <ScoreGauge score={candidate.match_score} size={130} strokeWidth={12} label="Job Match" />
        </div>
      </GlassCard>

      {/* AI Verdict Summary Banner */}
      <GlassCard className="border-l-4 border-l-purple-600">
        <div className="flex items-start space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">AI Executive Verdict</h3>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed font-medium">{candidate.ai_summary}</p>
          </div>
        </div>
      </GlassCard>

      {/* Skill Gaps Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Matched Skills */}
        <GlassCard>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Matched Qualifications & Skills</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {candidate.matched_skills?.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Missing Skills */}
        <GlassCard>
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-amber-600" />
            <span>Missing / Unverified Skills</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {candidate.missing_skills?.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200 flex items-center space-x-1.5"
              >
                <XCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Tailored AI Interview Questions */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>Personalized AI Interview Questions</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Tailored to candidates skill gaps</span>
        </div>

        <div className="space-y-3">
          {candidate.interview_questions?.map((question, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start space-x-3 text-xs">
                <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                  Q{idx + 1}
                </span>
                <p className="text-slate-800 leading-relaxed font-semibold">{question}</p>
              </div>
              <button
                onClick={() => copyToClipboard(question, idx)}
                className="p-1.5 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                title="Copy Question"
              >
                {copiedIdx === idx ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recruiter Decision Bar */}
      <GlassCard className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
            Recruiter Decision Actions
          </h4>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">
            Changing status automatically dispatches a branded notification email via Resend.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {['Shortlisted', 'Analyzed', 'Pending', 'Rejected'].map((st) => (
            <button
              key={st}
              disabled={updatingStatus}
              onClick={() => handleStatusChange(st)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                candidate.status === st
                  ? 'apple-btn-primary shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
