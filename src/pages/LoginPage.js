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
      if (users.length) {
        // success!
        localStorage.setItem('token', users[0].id);
        navigate('/dashboard');
      } else {
        setError('Invalid email/password/role');
      }
    } catch (err) {
      console.error(err);
      setError('Server error, try again later');
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
            <option value="employer">Employer</option>
            <option value="jobseeker">Job Seeker</option>
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
    background: '#e0f7fa',
    padding: '1rem',
  },
  card: {
    background: '#fff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    width: '360px',
    textAlign: 'center',
  },
  heading: {
    marginBottom: '1.5rem',
    color: '#00796b',
    fontSize: '1.75rem',
    fontFamily: 'Segoe UI, sans-serif',
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
    background: '#004179ff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  signupText: { marginTop: '1.25rem', fontSize: '0.9rem', color: '#555' },
  link: { color: '#00796b', textDecoration: 'none', fontWeight: '600' },
};


