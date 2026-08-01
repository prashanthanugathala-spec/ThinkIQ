import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';
import { fetchJobs, uploadResume } from '../services/api';
import { UploadCloud, FileText, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const UploadResume = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialJobId = searchParams.get('job_id') || '';

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(initialJobId);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // AI Step State
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const steps = [
    "Saving PDF resume file securely...",
    "Extracting plain text & profile layout...",
    "Constructing Gemini 1.5 prompt & evaluation rules...",
    "Computing skill alignment & missing gap vector...",
    "Generating personalized technical interview questions..."
  ];

  useEffect(() => {
    fetchJobs().then((data) => {
      setJobs(data);
      if (!selectedJobId && data.length > 0) {
        setSelectedJobId(data[0].id.toString());
      }
    });
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedJobId) {
      setErrorMsg("Please select a target Job Description.");
      return;
    }
    if (!file) {
      setErrorMsg("Please select or drop a PDF resume file.");
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 800);

    try {
      const formData = new FormData();
      formData.append('job_id', selectedJobId);
      if (name) formData.append('name', name);
      if (email) formData.append('email', email);
      formData.append('file', file);

      const candidateResult = await uploadResume(formData);
      clearInterval(stepInterval);
      setIsProcessing(false);

      navigate(`/analysis/${candidateResult.id}`);
    } catch (err) {
      clearInterval(stepInterval);
      setIsProcessing(false);
      console.error(err);
      const message = err.response?.data?.detail || "Error executing AI resume parsing. Please check file format and try again.";
      setErrorMsg(message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center space-x-3">
          <UploadCloud className="w-8 h-8 text-blue-600" />
          <span>AI Resume Studio</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Upload candidate PDF resumes to compute match scores, extract skill gaps, and generate interview questions.
        </p>
      </div>

      <GlassCard glow={true}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Job Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Target Job Opening *
            </label>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full p-3.5 rounded-xl glass-input text-slate-900 text-sm bg-slate-50 focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>-- Select a Job Description --</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.department})
                </option>
              ))}
            </select>
          </div>

          {/* Optional Override Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Candidate Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Extracted automatically if left blank"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Candidate Email (Optional)
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-slate-900 text-sm"
              />
            </div>
          </div>

          {/* Drag & Drop File Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Resume Document (PDF, DOCX, TXT) *
            </label>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : file
                  ? 'border-emerald-500 bg-emerald-50/50'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/80'
              }`}
            >
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                {file ? (
                  <>
                    <FileText className="w-12 h-12 text-emerald-600 mb-3" />
                    <p className="text-sm font-bold text-emerald-700">{file.name}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {(file.size / 1024).toFixed(1)} KB — Click to change file
                    </p>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-full bg-blue-50 text-blue-600 mb-3 shadow-sm">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      Drag & Drop resume PDF here, or <span className="text-blue-600 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      Supports PDF, DOCX, TXT formats up to 10MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="apple-btn-primary w-full py-4 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? "Processing AI Analysis..." : "Execute AI Resume Evaluation"}</span>
            </button>
          </div>
        </form>
      </GlassCard>

      {/* AI Processing Step Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-6 shadow-2xl">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <Sparkles className="w-6 h-6 text-blue-600 absolute" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Google Gemini AI Processing</h3>
              <p className="text-xs text-slate-500 mt-1 font-medium">Analyzing candidate qualifications & score vectors...</p>
            </div>

            <div className="space-y-3 text-left">
              {steps.map((stepText, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 text-xs p-3 rounded-xl transition-all ${
                    idx === currentStep
                      ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                      : idx < currentStep
                      ? 'text-emerald-700 font-semibold'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  {idx < currentStep ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${idx === currentStep ? 'bg-blue-600 animate-ping' : 'bg-slate-300'}`} />
                  )}
                  <span>{stepText}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
