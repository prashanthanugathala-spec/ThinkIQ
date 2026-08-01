import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { fetchCandidates, fetchJobs, updateCandidateStatus, deleteCandidate } from '../services/api';
import { Users, Filter, Sparkles, Search, UploadCloud, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchCandidates(selectedJobId ? parseInt(selectedJobId) : null), fetchJobs()]).then(
      ([cands, jobsList]) => {
        setCandidates(cands);
        setJobs(jobsList);
        setLoading(false);
      }
    );
  };

  const handleFilterChange = (jobId) => {
    setSelectedJobId(jobId);
    setLoading(true);
    fetchCandidates(jobId ? parseInt(jobId) : null).then((data) => {
      setCandidates(data);
      setLoading(false);
    });
  };

  const handleStatusChange = async (candidateId, newStatus) => {
    try {
      const updated = await updateCandidateStatus(candidateId, newStatus);
      setCandidates((prev) =>
        prev.map((c) => (c.id === candidateId ? { ...c, status: updated.status } : c))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCandidate = async (candidateId, candidateName) => {
    if (window.confirm(`Are you sure you want to remove the application for "${candidateName}"? This will permanently delete their parsed resume and AI assessment.`)) {
      try {
        await deleteCandidate(candidateId);
        setCandidates((prev) => prev.filter((c) => c.id !== candidateId));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <span>Candidate Directory</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Browse evaluated candidate profiles, adjust pipeline status, or remove applications.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by candidate name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input text-slate-900"
          />
        </div>

        {/* Job Filter */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedJobId}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="p-2.5 rounded-xl glass-input text-slate-900 text-xs bg-slate-50 w-full md:w-64"
          >
            <option value="">All Job Positions</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.title}
              </option>
            ))}
          </select>
        </div>
      </GlassCard>

      {/* Candidate Directory Table / Empty State */}
      <GlassCard>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">No Candidates Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
              No candidate resumes match your criteria. Upload candidate PDF resumes to generate match scores and candidate insights.
            </p>
            <div className="pt-2">
              <Link
                to="/upload"
                className="apple-btn-primary px-6 py-3 rounded-full font-bold text-xs shadow-md inline-flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Upload Candidate Resume</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-4 px-4 rounded-l-xl">Candidate</th>
                  <th className="py-4 px-4">Match Score</th>
                  <th className="py-4 px-4">Top Skills</th>
                  <th className="py-4 px-4">Pipeline Status</th>
                  <th className="py-4 px-4 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-extrabold text-slate-900 text-sm">{candidate.name}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5 font-medium">
                          {candidate.email || 'No email provided'}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          candidate.match_score >= 90
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : candidate.match_score >= 80
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {candidate.match_score}% Match
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {candidate.matched_skills?.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={candidate.status}
                        onChange={(e) => handleStatusChange(candidate.id, e.target.value)}
                        className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Analyzed">Analyzed</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <Link
                        to={`/analysis/${candidate.id}`}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-colors inline-flex items-center space-x-1"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Assessment</span>
                      </Link>

                      {/* Remove Candidate Application Button */}
                      <button
                        onClick={() => handleDeleteCandidate(candidate.id, candidate.name)}
                        title="Remove Candidate Application"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors inline-flex items-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};
