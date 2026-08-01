import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Briefcase, UploadCloud, Users, Columns, Cpu, Zap } from 'lucide-react';

export const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/jobs', label: 'Job Descriptions', icon: Briefcase },
    { path: '/upload', label: 'AI Resume Studio', icon: UploadCloud, highlight: true },
    { path: '/candidates', label: 'Candidate Directory', icon: Users },
    { path: '/compare', label: 'Candidate Matrix', icon: Columns },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-200/80 min-h-screen flex flex-col justify-between p-4 sticky top-0 h-screen bg-white/80">
      <div>
        {/* Brand Logo & Header */}
        <Link to="/" className="flex items-center space-x-3 px-3 py-4 mb-6 hover:opacity-90 transition-opacity">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold font-sans text-base tracking-tight text-slate-900">
              TalentIQ AI
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
              Recruiter OS v1.1
            </p>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border border-blue-200/80 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  } ${item.highlight ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60' : ''}`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50/50 border border-slate-200/80 shadow-xs">
        <div className="flex items-center space-x-2 text-blue-600 mb-2">
          <Zap className="w-4 h-4 fill-blue-600/20" />
          <span className="text-xs font-bold">AI Match Engine</span>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed mb-3 font-medium">
          Instant candidate scoring, skill gap extraction & personalized questions.
        </p>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full w-[94%]" />
        </div>
      </div>
    </aside>
  );
};
