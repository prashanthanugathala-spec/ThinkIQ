import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { fetchJobs, createJob, updateJob, deleteJob } from '../services/api';
import { Plus, Briefcase, MapPin, Layers, Sparkles, X, Check, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Senior (5+ yrs)');
  const [location, setLocation] = useState('Remote / Hybrid');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = () => {
    setLoading(true);
    fetchJobs().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  };

  const handleOpenCreateModal = () => {
    setEditingJob(null);
    setTitle('');
    setDepartment('Engineering');
    setDescription('');
    setSkillsInput('');
    setExperienceLevel('Senior (5+ yrs)');
    setLocation('Remote / Hybrid');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job) => {
    setEditingJob(job);
    setTitle(job.title || '');
    setDepartment(job.department || 'Engineering');
    setDescription(job.description || '');
    setSkillsInput(job.required_skills ? job.required_skills.join(', ') : '');
    setExperienceLevel(job.experience_level || 'Senior (5+ yrs)');
    setLocation(job.location || 'Remote / Hybrid');
    setIsModalOpen(true);
  };

  const handleDeleteJob = async (jobId, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this job description? Candidates associated with this role will be affected.')) {
      try {
        await deleteJob(jobId);
        loadJobs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const required_skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);

    const payload = {
      title,
      department,
      description,
      required_skills: required_skills.length ? required_skills : ['React', 'Python', 'FastAPI'],
      experience_level: experienceLevel,
      location,
    };

    try {
      if (editingJob) {
        await updateJob(editingJob.id, payload);
      } else {
        await createJob(payload);
      }
      setIsModalOpen(false);
      loadJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            Job Descriptions
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Manage active roles, edit target skills, and link candidate resume submissions.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="apple-btn-primary flex items-center space-x-2 px-6 py-3 rounded-full font-bold text-xs shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create Job Posting</span>
        </button>
      </div>

      {/* Jobs Grid / Empty State */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : jobs.length === 0 ? (
        <GlassCard className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-7 h-7" />
          </div>
          <h3 className="text-base font-extrabold text-slate-900">No Job Descriptions Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6 leading-relaxed font-medium">
            Your organization currently has no active job postings. Create your first job description to start screening candidate resumes.
          </p>
          <button
            onClick={handleOpenCreateModal}
            className="apple-btn-primary px-6 py-3 rounded-full font-bold text-xs shadow-md inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Job Posting</span>
          </button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <GlassCard key={job.id} className="flex flex-col justify-between h-full relative group">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
                    {job.department || 'Engineering'}
                  </span>
                  
                  {/* Action Buttons for Edit & Delete */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditModal(job)}
                      title="Edit Job Description"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteJob(job.id, e)}
                      title="Delete Job"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-1">{job.title}</h3>
                <span className="text-[11px] text-slate-500 font-medium flex items-center mb-3">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {job.location || 'Remote / Hybrid'}
                </span>

                <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed font-normal">
                  {job.description}
                </p>

                {/* Required Skills Badges */}
                <div className="mb-6">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">
                    Required Skills:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {job.required_skills?.slice(0, 5).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.required_skills?.length > 5 && (
                      <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-medium">
                        +{job.required_skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 flex items-center">
                  <Layers className="w-3.5 h-3.5 mr-1 text-purple-600" />
                  {job.experience_level}
                </span>
                <Link
                  to={`/upload?job_id=${job.id}`}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upload Resume</span>
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Modal Slide-Over for Creating / Editing Job Posting */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-extrabold text-slate-900 mb-1 flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>{editingJob ? 'Edit Job Description' : 'Create New Job Description'}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mb-6">
              {editingJob ? 'Update target role requirements and skill parameters.' : 'Enter target role parameters for AI candidate match scoring.'}
            </p>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Staff AI Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="Engineering / Product"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full p-3 rounded-xl glass-input text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full p-3 rounded-xl glass-input text-slate-900 bg-slate-50"
                  >
                    <option value="Junior (1-2 yrs)">Junior (1-2 yrs)</option>
                    <option value="Mid-Senior (3-5 yrs)">Mid-Senior (3-5 yrs)</option>
                    <option value="Senior (5+ yrs)">Senior (5+ yrs)</option>
                    <option value="Lead / Principal">Lead / Principal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Python, FastAPI, Docker, Gemini API"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Job Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe role responsibilities, team structure, and goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded-xl glass-input text-slate-900"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="apple-btn-primary px-6 py-2.5 rounded-full font-bold text-xs shadow-md flex items-center space-x-2"
                >
                  {submitting ? (
                    <span>Saving Job...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingJob ? 'Update Job Description' : 'Save Job Description'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
