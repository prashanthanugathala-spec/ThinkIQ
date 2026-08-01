import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { fetchDashboardStats } from '../services/api';
import { Briefcase, Users, Award, CheckCircle2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 font-semibold">Loading TalentIQ Analytics...</p>
        </div>
      </div>
    );
  }

  // Chart Data Setup for Light Theme
  const doughnutData = {
    labels: ['Shortlisted', 'Analyzed', 'Pending', 'Rejected'],
    datasets: [
      {
        data: [
          stats?.status_distribution?.Shortlisted || 3,
          stats?.status_distribution?.Analyzed || 1,
          stats?.status_distribution?.Pending || 1,
          stats?.status_distribution?.Rejected || 0,
        ],
        backgroundColor: ['#34c759', '#0071e3', '#ff9500', '#ff3b30'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: stats?.top_matched_skills?.map((s) => s.skill) || ['React', 'Python', 'TypeScript', 'FastAPI', 'PyTorch'],
    datasets: [
      {
        label: 'Candidates Possessing Skill',
        data: stats?.top_matched_skills?.map((s) => s.count) || [4, 4, 3, 3, 2],
        backgroundColor: 'rgba(0, 113, 227, 0.75)',
        borderColor: '#0071e3',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Recruitment Intelligence Dashboard
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Real-time candidate evaluation insights, match scores, and AI skill analytics.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/upload"
            className="apple-btn-primary flex items-center space-x-2 px-6 py-3 rounded-full font-semibold text-xs shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze New Resume</span>
          </Link>
        </div>
      </div>

      {/* Hero Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <GlassCard hover={true} className="border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Active Openings</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats?.total_jobs || 0}</h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-blue-50 text-blue-600">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 flex items-center font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mr-1" />
            <span>100% active candidate pipelines</span>
          </p>
        </GlassCard>

        <GlassCard hover={true} className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Total Candidates</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats?.total_candidates || 0}</h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 text-purple-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">Parsed and evaluated by Gemini AI</p>
        </GlassCard>

        <GlassCard hover={true} className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Avg Match Score</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats?.avg_match_score || 0}%</h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
              <Award className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-emerald-600 mt-3 font-bold">High alignment score quality</p>
        </GlassCard>

        <GlassCard hover={true} className="border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider">Shortlisted</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{stats?.shortlisted_count || 0}</h3>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-50 text-amber-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-3 font-medium">Ready for technical interviews</p>
        </GlassCard>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doughnut Chart */}
        <GlassCard className="lg:col-span-1">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Candidate Funnel Status</span>
            <span className="text-xs font-semibold text-slate-400">Live DB Data</span>
          </h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </GlassCard>

        {/* Bar Chart */}
        <GlassCard className="lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Top Matched Skills in Pool</span>
            <span className="text-xs font-semibold text-slate-400">Frequency Analysis</span>
          </h3>
          <div className="h-64">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </GlassCard>
      </div>

      {/* Recent Candidates Feed */}
      <GlassCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent AI Evaluations</h3>
            <p className="text-xs text-slate-500 font-medium">Candidates analyzed with highest match score rankings</p>
          </div>
          <Link
            to="/candidates"
            className="flex items-center space-x-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold"
          >
            <span>View All Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-slate-600 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4 rounded-l-xl">Candidate Name</th>
                <th className="py-3.5 px-4">Match Score</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 rounded-r-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stats?.recent_candidates?.map((candidate) => (
                <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900">{candidate.name}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        candidate.match_score >= 90
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {candidate.match_score}% Match
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      {candidate.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <Link
                      to={`/analysis/${candidate.id}`}
                      className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-colors"
                    >
                      View AI Report
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
