import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/userApi'; // our POST /users helper

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState('jobseeker');
  const [error,    setError]    = useState('');
  const navigate = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await registerUser({ fullName, email, password, role });
      // success!
      localStorage.setItem('token', data.id);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Registration failed, try again');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>CareerCrafter Sign Up</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Create Password"
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
            Register
          </button>
        </form>
        <p style={styles.signupText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Log in
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
    background: '#ffffff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    width: '360px',
    textAlign: 'center',
    transition: 'transform 0.3s ease',
  },
  heading: {
    marginBottom: '1.5rem',
    color: '#00796b',
    fontSize: '1.75rem',
    fontFamily: 'Segoe UI, sans-serif',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '0 0 1rem 0',
    borderRadius: '8px',
    border: '1px solid #b2dfdb',
    fontSize: '1rem',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '12px',
    margin: '0 0 1.5rem 0',
    borderRadius: '8px',
    border: '1px solid #b2dfdb',
    fontSize: '1rem',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#004179ff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
  },
  signupText: {
    marginTop: '1.25rem',
    fontSize: '0.9rem',
    color: '#555',
  },
  link: {
    color: '#004179ff',
    textDecoration: 'none',
    fontWeight: '600',
  },
};

