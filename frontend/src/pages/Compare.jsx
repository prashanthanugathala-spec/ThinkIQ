import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { ScoreGauge } from '../components/common/ScoreGauge';
import { fetchCandidates, compareCandidates } from '../services/api';
import { Columns, CheckCircle2, XCircle, Award, Sparkles } from 'lucide-react';

export const Compare = () => {
  const [searchParams] = useSearchParams();
  const initialCandidateId = searchParams.get('candidate_id');

  const [candidates, setCandidates] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparedData, setComparedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates().then((data) => {
      setCandidates(data);
      if (initialCandidateId) {
        const idNum = parseInt(initialCandidateId);
        const top3 = data.slice(0, 3).map((c) => c.id);
        const combined = Array.from(new Set([idNum, ...top3])).slice(0, 3);
        setSelectedIds(combined);
        executeComparison(combined);
      } else {
        const defaultIds = data.slice(0, 3).map((c) => c.id);
        setSelectedIds(defaultIds);
        executeComparison(defaultIds);
      }
      setLoading(false);
    });
  }, [initialCandidateId]);

  const executeComparison = (ids) => {
    if (ids.length === 0) {
      setComparedData([]);
      return;
    }
    compareCandidates(ids).then((res) => {
      setComparedData(res);
    });
  };

  const toggleCandidateSelection = (candidateId) => {
    let updated;
    if (selectedIds.includes(candidateId)) {
      updated = selectedIds.filter((id) => id !== candidateId);
    } else {
      if (selectedIds.length >= 4) return;
      updated = [...selectedIds, candidateId];
    }
    setSelectedIds(updated);
    executeComparison(updated);
  };

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-3">
          <Columns className="w-8 h-8 text-blue-600" />
          <span>Candidate Comparison Matrix</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Compare candidate qualifications, skill alignment vectors, and match scores side-by-side.
        </p>
      </div>

      {/* Candidate Selection Toolbar */}
      <GlassCard className="p-4">
        <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Select Candidates for Side-by-Side Evaluation (Max 4):
        </p>
        <div className="flex flex-wrap gap-2">
          {candidates.map((c) => {
            const isSelected = selectedIds.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggleCandidateSelection(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                  isSelected
                    ? 'apple-btn-primary shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{c.name}</span>
                <span className="opacity-80 text-[10px]">({c.match_score}%)</span>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Side-by-Side Comparison Cards Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : comparedData.length === 0 ? (
        <div className="text-center py-20 text-slate-500 text-xs font-medium">
          Select candidates above to view side-by-side breakdown.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparedData.map((cand, idx) => (
            <GlassCard key={cand.id} glow={idx === 0} className="flex flex-col justify-between space-y-6">
              <div>
                {/* Winner Badge for Highest Score */}
                {idx === 0 && (
                  <div className="mb-3">
                    <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>Highest Match Rank</span>
                    </span>
                  </div>
                )}

                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{cand.name}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{cand.email || 'No email'}</p>

                {/* Score Gauge */}
                <div className="py-6 flex justify-center">
                  <ScoreGauge score={cand.match_score} size={110} strokeWidth={10} label="Match Score" />
                </div>

                {/* Status Badge */}
                <div className="text-center mb-6">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Status: {cand.status}
                  </span>
                </div>

                {/* Matched Skills */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                    Matched Skills ({cand.matched_skills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cand.matched_skills?.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{s}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-2 mb-6">
                  <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider">
                    Missing Skills ({cand.missing_skills?.length || 0})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cand.missing_skills?.map((s, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold border border-amber-200 flex items-center space-x-1"
                      >
                        <XCircle className="w-3 h-3 text-amber-600" />
                        <span>{s}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Summary */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                  <span className="font-bold text-purple-700 flex items-center mb-1">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-purple-600" />
                    AI Summary:
                  </span>
                  {cand.ai_summary}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
