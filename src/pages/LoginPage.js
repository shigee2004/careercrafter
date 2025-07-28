// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api/userApi';  // our GET /users?email... helper

export default function LoginPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState('jobseeker');
  const [error,    setError]    = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await loginUser({ email, password, role });
      const users = res.data;

      if (!users.length) {
        setError('Invalid email/password/role');
        return;
      }

      const user = users[0];
      // persist whatever token you have; here we'll save their ID + role
      localStorage.setItem('token', user.id);
      localStorage.setItem('userId', user.id);

      // --- IMPORTANT: Save the role for routing protection ---
      localStorage.setItem('role', user.role); // 'employer' or 'jobseeker'

      // *** NAVIGATION TWEAK FOR EMPLOYERS ***
      if (user.role === 'employer') {
        navigate('/employer/select', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }

    } catch (err) {
      console.error(err);
      setError('Server error, please try again later');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>CareerCrafter Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            style={styles.select}
          >
            <option value="jobseeker">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>
            Log In
          </button>
        </form>

        <p style={styles.signupText}>
          Don’t have an account?{' '}
          <Link to="/register" style={styles.link}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#eef6ff',  // lighter blue shade
    padding: '1rem',
  },
  card: {
    background: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.08)',
    width: '360px',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '1.5rem',
    color: '#1976d2',   // main blue, NO GREEN
    fontSize: '1.75rem',
    fontFamily: 'Segoe UI, sans-serif',
    fontWeight: 700,
  },
  form: { display: 'flex', flexDirection: 'column' },
  input: {
    width: '100%',
    padding: '12px',
    margin: '0 0 1rem 0',
    borderRadius: '8px',
    border: '1px solid #b2dfdb',
    fontSize: '1rem',
  },
  select: {
    width: '100%',
    padding: '12px',
    margin: '0 0 1.5rem 0',
    borderRadius: '8px',
    border: '1px solid #b2dfdb',
    fontSize: '1rem',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#1976d2',   // blue!
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 600,
  },
  signupText: { marginTop: '1.25rem', fontSize: '0.9rem', color: '#555' },
  link: { color: '#1976d2', textDecoration: 'none', fontWeight: '600' },  // blue link
  error: { color: 'red', marginBottom: '1rem' }
};





