import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/userApi';
import Navbar from '../components/Navbar';
import './EmployerSelectLogin.css';

export default function EmployerSelectLogin() {
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/companies')
      .then(res => setCompanies(res.data))
      .catch(console.error);
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!companyId) {
      setError('Please select a company');
      return;
    }

    try {
      const res = await loginUser({ email, password, role: 'employer' });
      if (res.data.length > 0) {
        // store token and company info
        localStorage.setItem('token', res.data[0].id);
        localStorage.setItem('companyId', companyId);

        // Also save the company name for future job posting or display
        const selectedCompany = companies.find(c => c.id === companyId);
        if (selectedCompany) {
          localStorage.setItem('companyName', selectedCompany.name);
        }

        navigate('/employer');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Server error, try later');
    }
  };

  return (
    <>
      <Navbar />
      <div className="empl-select-root">
        <form className="empl-select-card" onSubmit={handleSubmit}>
          <h2>Select Company and Login</h2>

          <select
            value={companyId}
            onChange={e => setCompanyId(e.target.value)}
            required
          >
            <option value="">-- Select Company --</option>
            {companies.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input
            type="email"
            placeholder="Enter your official email"
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

          <button type="submit">Continue to Dashboard</button>
        </form>
      </div>
    </>
  );
}

