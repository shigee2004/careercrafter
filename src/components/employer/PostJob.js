// src/components/employer/PostJob.js
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { createJob } from '../../api/jobApi';  // ← added
import './PostJob.css';

const SIDEBAR_WIDTH = 220;

export default function PostJob() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    workplaceType: '',
    location: '',
    type: '',
    description: ''
  });

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    createJob(form)                             // ← call your API
      .then(res => {
        alert('Job posted successfully!');
        // reset form if you like:
        setForm({ title:'', workplaceType:'', location:'', type:'', description:'' });
      })
      .catch(err => {
        console.error(err);
        alert('Failed to post job.');
      });
  };

  return (
    <div style={{ paddingTop: 60 /* navbar height */ }}>
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={()=>setSidebarOpen(false)}
        role="employer"
      />

      <div
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-left 0.3s ease-out'
        }}
      >
        <div className="post-job-container">
          <div className="post-job-card">
            <h2>Post a New Job</h2>
            <form className="post-job-form" onSubmit={handleSubmit}>
              <label>
                Job Title:
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
              </label>

              <label>
                Workplace Type:
                <select
                  name="workplaceType"
                  value={form.workplaceType}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Remote</option>
                  <option>On-site</option>
                  <option>Hybrid</option>
                </select>
              </label>

              <label>
                Location (City, State, Country):
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                />
              </label>

              <label>
                Job Type:
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                </select>
              </label>

              <label>
                Requirements:
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              <button type="submit">Post Job</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

