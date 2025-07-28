// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import Dashboard           from './pages/Dashboard';
import ProfilePage         from './pages/ProfilePage';
import ResumePage          from './pages/ResumePage';
import ViewResumePage      from './pages/ViewResumePage';
import EmployerDashboard   from './pages/EmployerDashboard';
import EmployerSelectLogin from './pages/EmployerSelectLogin';
import ApplyJobPage        from './pages/ApplyJobPage';

// ───── Employer feature pages ─────
import PostJob             from './components/employer/PostJob';
import ManageJobs          from './components/employer/ManageJobs';
import ViewApplications    from './components/employer/ViewApplications';

import ProtectedRoute      from './components/ProtectedRoute';

export default function App() {
  const auth = Boolean(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        {/* root */}
        <Route
          path="/"
          element={
            auth
              ? <Navigate to={localStorage.getItem('role') === 'employer' ? "/employer/apps" : "/dashboard"} replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* auth */}
        <Route
          path="/login"
          element={auth ? <Navigate to={localStorage.getItem('role') === 'employer' ? "/employer/apps" : "/dashboard"} replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={auth ? <Navigate to={localStorage.getItem('role') === 'employer' ? "/employer/apps" : "/dashboard"} replace /> : <RegisterPage />}
        />

        {/* JOBSEEKER protected area */}
        <Route element={<ProtectedRoute requiredRole="jobseeker" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/resume/:id" element={<ViewResumePage />} />
          <Route path="/apply/:jobId" element={<ApplyJobPage />} />
        </Route>

        {/* EMPLOYER protected area */}
        <Route element={<ProtectedRoute requiredRole="employer" />}>
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/employer/post" element={<PostJob />} />
          <Route path="/employer/manage" element={<ManageJobs />} />
          <Route path="/employer/apps" element={<ViewApplications />} />
          <Route path="/employer/select" element={<EmployerSelectLogin />} />
        </Route>

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}







