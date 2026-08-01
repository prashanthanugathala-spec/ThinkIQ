import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { fetchCandidateById, updateCandidateStatus, sendCandidateEmail } from '../services/api';
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, MessageSquare, Columns, Copy, Mail, Check } from 'lucide-react';

export const Analysis = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSentAlert, setEmailSentAlert] = useState(false);

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

  const handleSendEmail = async () => {
    setEmailSending(true);
    try {
      await sendCandidateEmail(candidate.id);
      setEmailSentAlert(true);
      setTimeout(() => setEmailSentAlert(false), 4000);
    } catch (err) {
      console.error(err);
      alert("Error triggering email dispatch via Resend API.");
    } finally {
      setEmailSending(false);
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
          {/* Send Email Button */}
          <button
            onClick={handleSendEmail}
            disabled={emailSending}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{emailSending ? 'Sending...' : 'Send Resend Qualification Email'}</span>
          </button>

          <Link
            to={`/compare?candidate_id=${candidate.id}`}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 shadow-sm"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Add to Compare</span>
          </Link>
        </div>
      </div>

      {emailSentAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Qualification email dispatched via Resend API to {candidate.email || 'candidate email address'}!</span>
          </div>
        </div>
      )}

      {/* Hero Header Card */}
      <GlassCard glow={true} className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {candidate.status}
            </span>
            <select
              value={candidate.status}
              disabled={updatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
            >
              <option value="Shortlisted">Shortlisted</option>
              <option value="Analyzed">Analyzed</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
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
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-slate-900">Matched Competencies ({candidate.matched_skills?.length || 0})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidate.matched_skills?.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Missing Skills */}
        <GlassCard>
          <div className="flex items-center space-x-2 mb-4">
            <XCircle className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-900">Missing Competency Gaps ({candidate.missing_skills?.length || 0})</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {candidate.missing_skills?.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold"
              >
                ✕ {skill}
              </span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* AI Tailored Technical Interview Questions */}
      <GlassCard className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">AI Tailored Interview Questions</h3>
            <p className="text-xs text-slate-500 font-medium">
              Custom technical questions generated specifically to probe candidate missing skills and verify strengths.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {candidate.interview_questions?.map((question, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs text-slate-800 font-semibold leading-relaxed pt-0.5">{question}</p>
              </div>
              <button
                onClick={() => copyToClipboard(question, idx)}
                title="Copy Question"
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex-shrink-0"
              >
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
