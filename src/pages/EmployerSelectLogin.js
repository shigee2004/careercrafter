import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/userApi';
import Navbar from '../components/Navbar';
import './EmployerSelectLogin.css';

export default function EmployerSelectLogin() {
  const [companies, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const selectedCompany = companies.find(c => c.id === companyId);

  useEffect(() => {
    axios.get('http://localhost:8000/companies')
      .then(res => setCompanies(res.data))
      .catch(console.error);

    // Fetch users for employer matching
    axios.get('http://localhost:8000/users')
      .then(res => setUsers(res.data))
      .catch(console.error);
  }, []);

  // Email domain validation
  function validEmail(email) {
    if (!selectedCompany || !selectedCompany.domain) return false;
    return email.endsWith(`@${selectedCompany.domain}`);
  }

  // Validate that name part matches an employer
  function validEmployer(email) {
    if (!selectedCompany) return false;
    if (!email.includes('@')) return false;
    const [namePart] = email.split('@');
    // Find employer with that fullName (case-insensitive)
    return users.some(
      u =>
        u.role === 'employer' &&
        u.fullName.toLowerCase() === namePart.toLowerCase()
    );
  }

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (!companyId) {
      setError('Please select a company');
      return;
    }

    if (!validEmail(email)) {
      setError(`Email must be of the format *@${selectedCompany.domain}`);
      return;
    }

    if (!validEmployer(email)) {
      setError('Employer not found. Use your full name as email prefix.');
      return;
    }

    if (password !== selectedCompany.password) {
      setError('Incorrect company password');
      return;
    }

    // You could check for employer's presence here, but since you already validated above, continue:
    // You might still want to store who is logging in:
    const [namePart] = email.split('@');
    const employer = users.find(
      u => u.role === 'employer' && u.fullName.toLowerCase() === namePart.toLowerCase()
    );

    // Store employer id and company id in localStorage for session management
    if (employer) {
      localStorage.setItem('token', employer.id);
      localStorage.setItem('companyId', companyId);
      navigate('/employer');
    } else {
      setError('Invalid employer credentials');
    }
  };

  // Enable button only if company is selected, email & password filled
  const isFormValid = companyId && validEmail(email) && validEmployer(email) && password;

  return (
    <>
      <Navbar />
      <div className="empl-select-root">
        <form className="empl-select-card" onSubmit={handleSubmit}>
          <h2>Select Company and Login</h2>

          <select
            value={companyId}
            onChange={e => {
              setCompanyId(e.target.value);
              setError('');
            }}
            required
          >
            <option value="">-- Select Company --</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input
            type="email"
            placeholder={
              selectedCompany
                ? `Enter your official email (@${selectedCompany.domain})`
                : "Enter your official email"
            }
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter company password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid}
            style={{
              background: isFormValid ? "#007bff" : "#b5d1fa",
              cursor: isFormValid ? "pointer" : "not-allowed"
            }}
          >
            Continue to Dashboard
          </button>
        </form>
      </div>
    </>
  );
}



