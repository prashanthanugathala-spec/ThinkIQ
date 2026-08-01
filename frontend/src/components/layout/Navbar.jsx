import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, User, Briefcase, Users, Sparkles, X, ChevronRight } from 'lucide-react';
import { useUser, UserButton, SignInButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { fetchJobs, fetchCandidates } from '../../services/api';

export const Navbar = () => {
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Keyboard Shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch search data on focus
  const handleFocus = async () => {
    setIsOpen(true);
    if (jobs.length === 0 && candidates.length === 0) {
      setLoading(true);
      try {
        const [jList, cList] = await Promise.all([fetchJobs(), fetchCandidates()]);
        setJobs(jList || []);
        setCandidates(cList || []);
      } catch (err) {
        console.error('Search data fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Outside click handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !searchInputRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Search Results
  const trimmed = query.trim().toLowerCase();
  
  const matchedJobs = trimmed
    ? jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(trimmed) ||
          j.department?.toLowerCase().includes(trimmed) ||
          j.required_skills?.some((s) => s.toLowerCase().includes(trimmed))
      )
    : jobs.slice(0, 3);

  const matchedCandidates = trimmed
    ? candidates.filter(
        (c) =>
          c.name.toLowerCase().includes(trimmed) ||
          c.email?.toLowerCase().includes(trimmed) ||
          c.status.toLowerCase().includes(trimmed) ||
          c.matched_skills?.some((s) => s.toLowerCase().includes(trimmed))
      )
    : candidates.slice(0, 4);

  const handleSelectCandidate = (candidateId) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/analysis/${candidateId}`);
  };

  const handleSelectJob = (jobId) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/candidates`);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between bg-white/80">
      {/* Optimized Global Search Engine Bar */}
      <div className="relative flex items-center w-72 md:w-96">
        <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onFocus={handleFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search candidates, skills, or job roles... (⌘K)"
          className="w-full pl-10 pr-9 py-2 text-xs rounded-full glass-input text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 text-slate-400 hover:text-slate-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Global Search Dropdown Modal */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-12 left-0 w-[420px] max-h-[480px] overflow-y-auto bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
          >
            {loading ? (
              <div className="flex items-center justify-center py-8 text-xs text-slate-400 space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Indexing search records...</span>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Search Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {trimmed ? `Search Results for "${query}"` : 'Quick Search Suggestions'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Press ESC to close</span>
                </div>

                {/* Matching Candidates */}
                <div>
                  <div className="flex items-center space-x-1.5 font-bold text-slate-700 mb-2">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Candidates ({matchedCandidates.length})</span>
                  </div>

                  {matchedCandidates.length === 0 ? (
                    <p className="text-slate-400 text-[11px] italic pl-5">No matching candidates found.</p>
                  ) : (
                    <div className="space-y-1">
                      {matchedCandidates.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => handleSelectCandidate(c.id)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50/80 cursor-pointer group transition-colors"
                        >
                          <div>
                            <p className="font-extrabold text-slate-900 group-hover:text-blue-600">{c.name}</p>
                            <p className="text-slate-500 text-[11px]">{c.email || 'No email'}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                              {c.match_score}% Match
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Matching Job Descriptions */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-1.5 font-bold text-slate-700 mb-2">
                    <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                    <span>Job Openings ({matchedJobs.length})</span>
                  </div>

                  {matchedJobs.length === 0 ? (
                    <p className="text-slate-400 text-[11px] italic pl-5">No matching jobs found.</p>
                  ) : (
                    <div className="space-y-1">
                      {matchedJobs.map((j) => (
                        <div
                          key={j.id}
                          onClick={() => handleSelectJob(j.id)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-purple-50/80 cursor-pointer group transition-colors"
                        >
                          <div>
                            <p className="font-extrabold text-slate-900 group-hover:text-purple-600">{j.title}</p>
                            <p className="text-slate-500 text-[11px]">{j.department || 'Engineering'}</p>
                          </div>
                          <Sparkles className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-600" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Notifications */}
        <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        {/* Clerk Authentication Profile Button */}
        <div className="pl-2 border-l border-slate-200 flex items-center">
          {isSignedIn ? (
            <div className="flex items-center space-x-3">
              <span className="hidden md:inline-block text-xs font-semibold text-slate-700">
                {user?.fullName || user?.primaryEmailAddress?.emailAddress}
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="apple-btn-primary flex items-center space-x-2 px-5 py-2 rounded-full font-semibold text-xs shadow-sm">
                <User className="w-3.5 h-3.5" />
                <span>Recruiter Sign In</span>
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
};
