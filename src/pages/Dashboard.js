// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilter } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FeaturedOpportunityCard from '../components/FeaturedOpportunityCard';
import CompanyCard from '../components/CompanyCard';
import './Dashboard.css';

const SIDEBAR_WIDTH = 220;

export default function Dashboard() {
  const [jobs, setJobs]               = useState([]);
  const [companies, setCompanies]     = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // fetch jobs
  useEffect(() => {
    axios.get('http://localhost:8000/jobs')
      .then(res => setJobs(res.data))
      .catch(console.error)
      .finally(() => setLoadingJobs(false));
  }, []);

  // fetch companies
  useEffect(() => {
    axios.get('http://localhost:8000/companies')
      .then(res => setCompanies(res.data))
      .catch(console.error)
      .finally(() => setLoadingCompanies(false));
  }, []);

  return (
    <div className="dashboard-root">
      {/* Navbar with hamburger */}
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />

      {/* Off‑canvas Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Hero */}
      <section className="hero">
        <h1>
          Craft Your Perfect <span className="hero-accent">Career Path</span>
        </h1>
        <p>Connect with top employers and discover opportunities that match your ambitions</p>
        <div className="search-bar">
          <input placeholder="Job title, keywords, or company" />
          <input placeholder="City, state, or remote" />
          <button>Search Jobs</button>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stat-card"><h2>50,000+</h2><p>Active Jobs</p></div>
        <div className="stat-card"><h2>5,000+</h2><p>Companies</p></div>
        <div className="stat-card"><h2>1M+</h2><p>Job Seekers</p></div>
        <div className="stat-card"><h2>95%</h2><p>Success Rate</p></div>
      </section>

      {/* Main Content */}
      <div
        className="dashboard-content"
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-left 0.3s ease-out'
        }}
      >
        <main className="dashboard-main">
          
          {/* Featured Opportunities */}
          <div className="section-header">
            <h2>Featured Opportunities</h2>
            <button className="filter-btn"><FaFilter /> Filters</button>
          </div>

          {loadingJobs ? (
            <p>Loading jobs…</p>
          ) : jobs.filter(j => j.featured).length === 0 ? (
            <p>No featured jobs found.</p>
          ) : (
            jobs
              .filter(j => j.featured)
              .map(j => (
                <FeaturedOpportunityCard key={j.id} job={j} />
              ))
          )}

          {/* Explore Top Companies */}
          <h2 className="companies-header">Explore Top Companies</h2>
          <div className="companies-grid">
            {loadingCompanies ? (
              <p>Loading companies…</p>
            ) : companies.length === 0 ? (
              <p>No companies found.</p>
            ) : (
              companies.map(c => (
                <CompanyCard key={c.id} company={c} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}





