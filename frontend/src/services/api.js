import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get active user ID / email for user organization isolation
export const getUserScopeId = () => {
  const savedUserId = localStorage.getItem('talentiq_user_id');
  if (savedUserId) return savedUserId;
  return 'user_admin'; // Default demo scope
};

// Add interceptor to include X-User-ID header in every request
api.interceptors.request.use((config) => {
  config.headers['X-User-ID'] = getUserScopeId();
  return config;
});

// User Sync API
export const syncUser = async (userData) => {
  try {
    const res = await api.post('/users/sync', userData);
    return res.data;
  } catch (error) {
    console.warn('User sync notice:', error);
    return null;
  }
};

// Jobs API
export const fetchJobs = async (userId = null) => {
  try {
    const scopeId = userId || getUserScopeId();
    const res = await api.get(`/jobs/?user_id=${scopeId}`);
    return res.data;
  } catch (error) {
    console.warn('Jobs API fallback:', error);
    return [];
  }
};

export const createJob = async (jobData, userId = null) => {
  const scopeId = userId || getUserScopeId();
  const payload = { ...jobData, created_by: scopeId };
  const res = await api.post('/jobs/', payload);
  return res.data;
};

export const updateJob = async (jobId, jobData) => {
  const res = await api.put(`/jobs/${jobId}`, jobData);
  return res.data;
};

export const deleteJob = async (jobId) => {
  const res = await api.delete(`/jobs/${jobId}`);
  return res.data;
};

// Candidates API
export const fetchCandidates = async (jobId = null, userId = null) => {
  try {
    const scopeId = userId || getUserScopeId();
    let url = `/candidates/?user_id=${scopeId}`;
    if (jobId) url += `&job_id=${jobId}`;
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    console.warn('Candidates API fallback:', error);
    return [];
  }
};

export const fetchCandidateById = async (candidateId) => {
  const res = await api.get(`/candidates/${candidateId}`);
  return res.data;
};

export const uploadResume = async (formData) => {
  const scopeId = getUserScopeId();
  formData.append('user_id', scopeId);
  
  const res = await axios.post(`${API_BASE_URL}/candidates/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-User-ID': scopeId
    },
  });
  return res.data;
};

export const updateCandidateStatus = async (candidateId, newStatus) => {
  const res = await api.put(`/candidates/${candidateId}/status`, { status: newStatus });
  return res.data;
};

export const sendCandidateEmail = async (candidateId) => {
  const res = await api.post(`/candidates/${candidateId}/send-email`);
  return res.data;
};

export const deleteCandidate = async (candidateId) => {
  const res = await api.delete(`/candidates/${candidateId}`);
  return res.data;
};

export const compareCandidates = async (candidateIds) => {
  const scopeId = getUserScopeId();
  const res = await api.post('/candidates/compare', { candidate_ids: candidateIds, created_by: scopeId });
  return res.data;
};

// Dashboard Stats API
export const fetchDashboardStats = async (userId = null) => {
  try {
    const scopeId = userId || getUserScopeId();
    const res = await api.get(`/dashboard/stats?user_id=${scopeId}`);
    return res.data;
  } catch (error) {
    console.warn('Dashboard stats fallback:', error);
    return {
      total_jobs: 0,
      total_candidates: 0,
      avg_match_score: 0,
      shortlisted_count: 0,
      status_distribution: { Pending: 0, Analyzed: 0, Shortlisted: 0, Rejected: 0 },
      recent_candidates: [],
      top_matched_skills: [],
      top_missing_skills: []
    };
  }
};
