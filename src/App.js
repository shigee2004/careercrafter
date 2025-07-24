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

// ───── Employer feature pages ─────
import PostJob             from './components/employer/PostJob';
import ManageJobs          from './components/employer/ManageJobs';

import ViewApplications    from './components/employer/ViewApplications';

function PrivateRoute({ children }) {
  const auth = Boolean(localStorage.getItem('token'));
  return auth ? children : <Navigate to="/login" replace />;
}

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
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* auth */}
        <Route
          path="/login"
          element={auth ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={auth ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />

        {/* job‑seeker */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/profile"
          element={<PrivateRoute><ProfilePage /></PrivateRoute>}
        />
        <Route
          path="/resume"
          element={<PrivateRoute><ResumePage /></PrivateRoute>}
        />
        <Route
          path="/resume/:id"
          element={<PrivateRoute><ViewResumePage /></PrivateRoute>}
        />

        {/* employer */}
        <Route
          path="/employer"
          element={<PrivateRoute><EmployerDashboard /></PrivateRoute>}
        />
        <Route
          path="/employer/post"
          element={<PrivateRoute><PostJob /></PrivateRoute>}
        />
        <Route
          path="/employer/manage"
          element={<PrivateRoute><ManageJobs /></PrivateRoute>}
        />
        
        <Route
          path="/employer/apps"
          element={<PrivateRoute><ViewApplications /></PrivateRoute>}
        />
        {/* after initial employer-login we hit this select page */}
        <Route path="/employer/select" element={
        <PrivateRoute><EmployerSelectLogin/></PrivateRoute>}
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}






