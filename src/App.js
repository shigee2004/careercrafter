// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LoginPage      from './pages/LoginPage';
import RegisterPage   from './pages/RegisterPage';
import Dashboard      from './pages/Dashboard';
import ProfilePage    from './pages/ProfilePage';
import ResumePage     from './pages/ResumePage';
import ViewResumePage from './pages/ViewResumePage';
import ResumePreview  from './pages/ResumePreview';

function PrivateRoute({ children }) {
  const auth = Boolean(localStorage.getItem('token'));
  return auth ? children : <Navigate to="/login" replace />;
}

function App() {
  const auth = Boolean(localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        {/* root: send logged‑in folks to /dashboard, others to /login */}
        <Route
          path="/"
          element={
            auth
              ? <Navigate to="/dashboard" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* login/register are public */}
        <Route
          path="/login"
          element={
            auth ? <Navigate to="/dashboard" replace /> : <LoginPage />
          }
        />
        <Route
          path="/register"
          element={
            auth ? <Navigate to="/dashboard" replace /> : <RegisterPage />
          }
        />

        {/* protected: dashboard + profile */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        {/* resume list, edit & preview */}
        <Route
          path="/resume"
          element={
            <PrivateRoute>
              <ResumePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume/preview"
          element={
            <PrivateRoute>
              <ResumePreview />
            </PrivateRoute>
          }
        />
        <Route
          path="/resume/:id"
          element={
            <PrivateRoute>
              <ViewResumePage />
            </PrivateRoute>
          }
        />

        {/* catch‑all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;




