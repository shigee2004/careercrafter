// src/pages/ApplyJobPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJobs } from '../api/jobApi';
import { createApplication } from '../api/applicationApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './ApplyJobPage.css';

const SIDEBAR_WIDTH = 220;

export default function ApplyJobPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({
    candidateName: '',
    candidateEmail: '',
    candidatePhone: '',
    resumeFileName: '',
    coverLetter: ''
  });

  // load the job
  useEffect(() => {
    fetchJobs()
      .then(r => {
        const j = r.data.find(x => x.id === jobId);
        setJob(j);
      })
      .catch(console.error);
  }, [jobId]);

  // if you have a profile endpoint, you'd fetch & prefill here:
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    // e.g. axios.get(`/profiles?userId=${userId}`)...
    //   .then(res => setForm({...res.data[0], resumeFileName: ''}))
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = e => {
    const file = e.target.files[0];
    setForm(f => ({ ...f, resumeFileName: file?.name || '' }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const companyId = localStorage.getItem('companyId');
    const userId = localStorage.getItem('userId');

    createApplication({
      jobId,
      companyId,
      userId,
      ...form
    })
      .then(() => {
        alert('Application submitted!');
        navigate('/dashboard', { replace: true });
      })
      .catch(err => {
        console.error(err);
        alert('Failed to submit application');
      });
  };

  if (!job) return <p>Loading…</p>;

  return (
    <div style={{ paddingTop: 60 }}>
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-left 0.3s ease-out'
        }}
      >
        <div className="apply-page-container">
          <div className="apply-page-card">
            <h2>Apply for: {job.title}</h2>
            <form onSubmit={handleSubmit} className="apply-form">
              <label>
                Full Name
                <input
                  name="candidateName"
                  value={form.candidateName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="candidateEmail"
                  value={form.candidateEmail}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Phone
                <input
                  name="candidatePhone"
                  value={form.candidatePhone}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Cover Letter
                <textarea
                  name="coverLetter"
                  value={form.coverLetter}
                  onChange={handleChange}
                  rows={4}
                />
              </label>
              <label>
                Attach Resume (just capturing filename)
                <input type="file" onChange={handleFile} />
                {form.resumeFileName && (
                  <small>Uploaded: {form.resumeFileName}</small>
                )}
              </label>

              <button type="submit" className="btn-submit">
                Send Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

