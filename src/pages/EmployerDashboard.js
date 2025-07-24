// src/pages/EmployerDashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FaBullhorn, FaListAlt, FaDatabase, FaInbox } from 'react-icons/fa';
import './EmployerDashboard.css';


const SIDEBAR_WIDTH = 220;

export default function EmployerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="dashboard-root">
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role="employer"
      />

      <div
        className="dashboard-content"
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-left 0.3s ease-out'
        }}
      >
        <main className="dashboard-main">
          <h2 className="section-header">Employer Dashboard</h2>

          <div className="cards-grid">
            <Link to="/employer/post" className="op-card">
              <div className="op-icon"><FaBullhorn /></div>
              <h3>Post Job Listing</h3>
              <p>Create a new job posting and describe the role.</p>
            </Link>

            <Link to="/employer/manage" className="op-card">
              <div className="op-icon"><FaListAlt /></div>
              <h3>Manage Job Listings</h3>
              <p>Edit, delete or archive your existing jobs.</p>
            </Link>

            

            <Link to="/employer/apps" className="op-card">
              <div className="op-icon"><FaInbox /></div>
              <h3>View Applications</h3>
              <p>See who’s applied to your job postings.</p>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

