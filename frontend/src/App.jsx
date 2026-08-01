import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { syncUser } from './services/api';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Jobs } from './pages/Jobs';
import { UploadResume } from './pages/UploadResume';
import { Analysis } from './pages/Analysis';
import { Candidates } from './pages/Candidates';
import { Compare } from './pages/Compare';

function AppLayout({ children }) {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      const userScopeId = user.id || user.primaryEmailAddress?.emailAddress;
      if (userScopeId) {
        localStorage.setItem('talentiq_user_id', userScopeId);
      }
      
      // Automatically sync recruiter account details to MySQL database
      syncUser({
        clerk_id: user.id,
        email: user.primaryEmailAddress?.emailAddress || 'recruiter@enterprise.com',
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        profile_image_url: user.imageUrl || '',
        role: 'Recruiter'
      });
    }
  }, [isSignedIn, user]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Step 1: Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Step 2: User Isolation Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          }
        />
        
        <Route
          path="/jobs"
          element={
            <AppLayout>
              <Jobs />
            </AppLayout>
          }
        />

        <Route
          path="/upload"
          element={
            <AppLayout>
              <UploadResume />
            </AppLayout>
          }
        />

        <Route
          path="/analysis/:id"
          element={
            <AppLayout>
              <Analysis />
            </AppLayout>
          }
        />

        <Route
          path="/candidates"
          element={
            <AppLayout>
              <Candidates />
            </AppLayout>
          }
        />

        <Route
          path="/compare"
          element={
            <AppLayout>
              <Compare />
            </AppLayout>
          }
        />

        {/* Fallback to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
