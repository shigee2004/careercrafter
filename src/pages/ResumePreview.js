import React, { useState, useEffect } from 'react';
import { fetchResume } from '../api/resumeApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import './ResumePreview.css';

const SIDEBAR_WIDTH = 220;

export default function ResumePreview() {
  const userId = localStorage.getItem('userId');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    if (!userId) return;
    fetchResume(userId)
      .then(res => {
        if (res.data.length) setResume(res.data[0]);
      })
      .catch(console.error);
  }, [userId]);

  if (!resume) return <p style={{ padding: '2rem' }}>Loading resume…</p>;

  return (
    <div className="resume-preview-root">
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className="resume-preview-content"
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-left 0.3s ease-out'
        }}
      >
        <div className="rp-header">
          <h1 className="rp-name">{resume.fullName}</h1>
          <div className="rp-contact">
            {resume.email} | {resume.phone}
          </div>
        </div>

        <section className="rp-section">
          <h2>Professional Summary</h2>
          <p>{resume.summary}</p>
        </section>

        <section className="rp-section">
          <h2>Experience</h2>
          {resume.experiences.map(exp => (
            <div key={exp.id} className="rp-item">
              <div className="rp-item-header">
                <strong>{exp.title}</strong>, {exp.company}
                <span className="rp-dates">
                  {exp.from} – {exp.to}
                </span>
              </div>
              <p>{exp.description}</p>
            </div>
          ))}
        </section>

        <section className="rp-section">
          <h2>Education</h2>
          {resume.education.map(edu => (
            <div key={edu.id} className="rp-item">
              <div className="rp-item-header">
                <strong>{edu.degree}</strong>, {edu.school}
                <span className="rp-dates">
                  {edu.from} – {edu.to}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
