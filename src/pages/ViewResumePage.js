import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { fetchResumeById } from '../api/resumeApi';
import './ViewResumePage.css';

const SIDEBAR_WIDTH = 220;

export default function ViewResumePage() {
  const { id } = useParams();          // grabs :id from URL
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resume, setResume]           = useState(null);

  useEffect(() => {
    fetchResumeById(id)
      .then(res => setResume(res.data))
      .catch(console.error);
  }, [id]);

  if (!resume) return <p style={{ padding:'2rem' }}>Loading resume…</p>;

  return (
    <div className="view-resume-root">
      <Navbar onMenuClick={()=>setSidebarOpen(o=>!o)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={()=>setSidebarOpen(false)}
      />

      <div
        className="view-resume-content"
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-left 0.3s ease'
        }}
      >
        <header className="resume-header">
          <h1>{resume.fullName}</h1>
          <p>{resume.email} | {resume.phone}</p>
        </header>

        <section className="resume-section">
          <h2>Professional Summary</h2>
          <p>{resume.summary || '—'}</p>
        </section>

        <section className="resume-section">
          <h2>Experience</h2>
          {resume.experiences.length
            ? resume.experiences.map(exp => (
                <div key={exp.id} className="resume-item">
                  <strong>{exp.title}</strong>, {exp.company}
                  <span className="dates">
                    {exp.from} – {exp.to}
                  </span>
                  <p>{exp.description}</p>
                </div>
              ))
            : <p>—</p>
          }
        </section>

        <section className="resume-section">
          <h2>Education</h2>
          {resume.education.length
            ? resume.education.map(edu => (
                <div key={edu.id} className="resume-item">
                  <strong>{edu.degree}</strong>, {edu.school}
                  <span className="dates">
                    {edu.from} – {edu.to}
                  </span>
                </div>
              ))
            : <p>—</p>
          }
        </section>

        {resume.resumeFile && (
          <section className="resume-section">
            <h2>Attached PDF</h2>
            <iframe
              src={resume.resumeFile}
              width="100%"
              height="600"
              title="Attached Resume"
              style={{ border: '1px solid #ccc' }}
            />
          </section>
        )}
      </div>
    </div>
  );
}
