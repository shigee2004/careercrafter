// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaFilter, FaBell } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FeaturedOpportunityCard from '../components/FeaturedOpportunityCard';
import CompanyCard from '../components/CompanyCard';
import './Dashboard.css';

const SIDEBAR_WIDTH = 220;

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // SEARCH STATES
  const [search, setSearch] = useState('');
  const [searchLoc, setSearchLoc] = useState('');

  // NOTIFICATION STATE
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userId');

  // FILTER MODAL STATE
  const [filterOpen, setFilterOpen] = useState(false);
  const [reqFilter, setReqFilter] = useState('');

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

  // Poll applications for notifications (with job/company details)
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(async () => {
      try {
        // Fetch applications for user
        const appsRes = await axios.get(`http://localhost:8000/applications?userId=${userId}`);
        const apps = appsRes.data.filter(app => app.notified === false && app.status && app.status !== 'Submitted');

        // Fetch jobs and companies for mapping
        const [jobsRes, companiesRes] = await Promise.all([
          axios.get('http://localhost:8000/jobs'),
          axios.get('http://localhost:8000/companies')
        ]);
        const jobsMap = {};
        jobsRes.data.forEach(j => { jobsMap[j.id] = j; });
        const companiesMap = {};
        companiesRes.data.forEach(c => { companiesMap[c.id] = c; });

        // Combine details for display
        const notificationsWithDetails = apps.map(app => ({
          ...app,
          jobTitle: jobsMap[app.jobId]?.title || 'Job',
          companyName: companiesMap[app.companyId]?.name || 'Company'
        }));

        setNotifications(notificationsWithDetails);
      } catch (e) {
        // Optional: Handle error
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  function markAsRead(appId) {
    axios.patch(`http://localhost:8000/applications/${appId}`, { notified: true })
      .then(() => setNotifications(n => n.filter(x => x.id !== appId)));
  }

  // Search filter logic
  const filteredJobs = jobs.filter(j =>
    (
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.company || '').toLowerCase().includes(search.toLowerCase())
    ) &&
    (
      searchLoc.trim() === '' ||
      (j.location || '').toLowerCase().includes(searchLoc.toLowerCase())
    )
  );

  // ** FILTER for requirements **
  const filteredByReq = reqFilter
    ? filteredJobs.filter(j =>
        (j.requirements || j.description || '')
          .toLowerCase()
          .includes(reqFilter.toLowerCase())
      )
    : filteredJobs;

  // Featured only
  const featuredJobs = filteredByReq.filter(j => j.featured);

  // --- NEW: Jobs posted per company logic ---
  // Use job.company (company name) as the key
  const jobsPerCompany = {};
  jobs.forEach(job => {
    if (job.company) {
      jobsPerCompany[job.company] = (jobsPerCompany[job.company] || 0) + 1;
    }
  });

  // Show only companies who have posted jobs
  const companiesWithJobs = companies.filter(c => jobsPerCompany[c.name]);

  // Helper: Modal for filter
  function FilterModal({ open, onClose }) {
    if (!open) return null;
    return (
      <div
        style={{
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh',
          background: 'rgba(80,100,120,0.18)', zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: '#fff', borderRadius: 12, padding: 32, minWidth: 320,
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)', position: 'relative'
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            style={{ position: 'absolute', right: 18, top: 16, fontSize: 20, border: 'none', background: 'none', cursor: 'pointer' }}
            onClick={onClose}
            aria-label="Close"
          >×</button>
          <h3 style={{ marginTop: 0 }}>Filter by Requirements</h3>
          <input
            style={{ width: '100%', fontSize: 16, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            placeholder="Type keywords, e.g. React, Python"
            value={reqFilter}
            onChange={e => setReqFilter(e.target.value)}
            autoFocus
          />
          <div style={{ marginTop: 16 }}>
            <button
              onClick={onClose}
              style={{
                padding: '7px 18px', borderRadius: 5, background: '#007bff',
                color: '#fff', border: 'none', cursor: 'pointer'
              }}
            >Apply</button>
            {reqFilter && (
              <button
                onClick={() => setReqFilter('')}
                style={{
                  marginLeft: 12,
                  padding: '7px 12px',
                  borderRadius: 5,
                  background: '#aaa',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >Clear</button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      {/* Navbar with hamburger */}
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />

      {/* Off‑canvas Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role="jobseeker"
      />

      {/* Hero */}
      <section className="hero">
        <h1>
          Craft Your Perfect <span className="hero-accent">Career Path</span>
        </h1>
        <p>Connect with top employers and discover opportunities that match your ambitions</p>
        <div className="search-bar">
          <input
            placeholder="Job title, keywords, or company"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <input
            placeholder="City, state, or remote"
            value={searchLoc}
            onChange={e => setSearchLoc(e.target.value)}
          />
          <button disabled>Search Jobs</button>
        </div>
      </section>

      {/* Stats */}
      <section className="stats">
        <div className="stat-card"><h2>50,000+</h2><p>Active Jobs</p></div>
        <div className="stat-card"><h2>5,000+</h2><p>Companies</p></div>
        <div className="stat-card"><h2>1M+</h2><p>Job Seekers</p></div>
        <div className="stat-card"><h2>95%</h2><p>Success Rate</p></div>
      </section>

      {/* ------- NOTIFICATION BAR: Right before dashboard-content -------- */}
      {notifications.length > 0 && (
        <div
          style={{
            background: '#fffbe8',
            borderBottom: '1px solid #ffd24c',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            justifyContent: 'flex-start',
            margin: '0 0 1.5rem 0'
          }}
        >
          <FaBell color="#f9b400" size={20} />
          {notifications.map(n => (
            <div key={n.id} style={{ marginRight: '2rem' }}>
              <span>
                Your application for <strong>{n.jobTitle}</strong> at <strong>{n.companyName}</strong> is now <b>{n.status}</b>
              </span>
              <button
                style={{
                  marginLeft: 12,
                  padding: '2px 10px',
                  borderRadius: 4,
                  border: 'none',
                  background: '#007bff',
                  color: '#fff',
                  cursor: 'pointer'
                }}
                onClick={() => markAsRead(n.id)}
              >
                Mark as read
              </button>
            </div>
          ))}
        </div>
      )}
      {/* --------------------------------------------------------------- */}

      {/* Main Content */}
      <div
        className="dashboard-content"
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-left 0.3s ease-out'
        }}
      >
        <main className="dashboard-main">

          {/* Filter Modal */}
          <FilterModal open={filterOpen} onClose={() => setFilterOpen(false)} />

          {/* Featured Opportunities */}
          <div className="section-header">
            <h2>Featured Opportunities</h2>
            <button
              className="filter-btn"
              onClick={() => setFilterOpen(true)}
              style={{ background: '#eef6ff', border: '1px solid #99c1ff', color: '#007bff', borderRadius: 6, padding: '5px 15px', cursor: 'pointer', fontWeight: 600 }}
            >
              <FaFilter /> Filters
            </button>
          </div>

          {loadingJobs ? (
            <p>Loading jobs…</p>
          ) : featuredJobs.length === 0 ? (
            <p>No featured jobs found.</p>
          ) : (
            featuredJobs.map(j => (
              <FeaturedOpportunityCard key={j.id} job={j} />
            ))
          )}

          {/* Explore Top Companies */}
          <h2 className="companies-header">Explore Top Companies</h2>
          <div className="companies-grid">
            {loadingCompanies ? (
              <p>Loading companies…</p>
            ) : companiesWithJobs.length === 0 ? (
              <p>No companies found.</p>
            ) : (
              companiesWithJobs.map(c => (
                <CompanyCard
                  key={c.id}
                  company={c}
                  jobsPosted={jobsPerCompany[c.name]}
                  jobs={jobs}
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}














