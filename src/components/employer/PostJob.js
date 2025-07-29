import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { createJob } from '../../api/jobApi';
import './PostJob.css';

const SIDEBAR_WIDTH = 220;

export default function PostJob() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    workplaceType: '',
    location: '',
    type: '',
    salary: '',
    description: '',
    featured: false
  });

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

 const handleSubmit = async e => {
  e.preventDefault();

  // Get the current companyId from localStorage
  const companyId = localStorage.getItem('companyId');
  if (!companyId) {
    alert("Company not found. Please login again.");
    return;
  }

  // Fetch the company details (to get the correct company name)
  let companyName = '';
  try {
    const res = await fetch(`http://localhost:8000/companies/${companyId}`);
    if (!res.ok) throw new Error("Not found");
    const company = await res.json();
    companyName = company.name;
  } catch (err) {
    alert("Could not fetch company info. Please login again.");
    return;
  }

  // Compose job object
  const jobWithCompany = {
    ...form,
    postedAt: new Date().toISOString(),
    company: companyName,
  };

  createJob(jobWithCompany)
    .then(res => {
      alert('Job posted successfully!');
      // reset to blank
      setForm({
        title: '',
        workplaceType: '',
        location: '',
        type: '',
        salary: '',
        description: '',
        featured: false
      });
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
        onClose={() => setSidebarOpen(false)}
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
                  required
                />
              </label>

              <label>
                Workplace Type:
                <select
                  name="workplaceType"
                  value={form.workplaceType}
                  onChange={handleChange}
                  required
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
                  required
                />
              </label>

              <label>
                Job Type:
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Internship</option>
                </select>
              </label>

              <label>
                Salary Range:
                <input
                  name="salary"
                  placeholder="e.g. 80k‑100k"
                  value={form.salary}
                  onChange={handleChange}
                />
              </label>

              <label>
                Requirements:
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="featured-checkbox">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                Mark as Featured
              </label>

              <button type="submit" className="post-btn">
                Post Job
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}




