import React, { useState, useEffect } from 'react';
import { FaSave, FaPlusCircle, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { fetchResume, createResume, updateResume } from '../api/resumeApi';
import './ResumePage.css';

const SIDEBAR_WIDTH = 220;

export default function ResumePage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userId = localStorage.getItem('userId');
  const [resume, setResume] = useState({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    experiences: [],
    education: []
  });
  const [resumeId, setResumeId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load existing resume or initialize blank
  useEffect(() => {
    if (!userId) return;
    fetchResume(userId)
      .then(res => {
        const arr = res.data;
        if (arr.length) {
          const doc = arr[0];
          setResumeId(doc.id);
          setResume(doc);
        } else {
          setResume(r => ({
            ...r,
            experiences: [{ id: Date.now(), title:'', company:'', from:'', to:'', description:'' }],
            education:    [{ id: Date.now()+1, school:'', degree:'', from:'', to:'' }]
          }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  // Auto-save with debounce
  useEffect(() => {
    if (loading) return;
    const tid = setTimeout(() => {
      const payload = { ...resume, userId };
      if (resumeId) {
        updateResume(resumeId, payload).catch(console.error);
      } else {
        createResume(payload)
          .then(r => setResumeId(r.data.id))
          .catch(console.error);
      }
    }, 500);
    return () => clearTimeout(tid);
  }, [resume, resumeId, userId, loading]);

  // Field and list handlers
  const updateField = (key, val) => setResume(r => ({ ...r, [key]: val }));
  const updateListItem = (list, id, key, val) => {
    setResume(r => ({
      ...r,
      [list]: r[list].map(item => item.id === id ? { ...item, [key]: val } : item)
    }));
  };
  const addListItem = list => {
    const newItem = list === 'experiences'
      ? { id: Date.now(), title:'', company:'', from:'', to:'', description:'' }
      : { id: Date.now(), school:'', degree:'', from:'', to:'' };
    setResume(r => ({ ...r, [list]: [...r[list], newItem] }));
  };
  const removeListItem = (list, id) => {
    setResume(r => ({
      ...r,
      [list]: r[list].filter(item => item.id !== id)
    }));
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading…</p>;

  return (
    <div className="resume-root">
      <Navbar onMenuClick={() => setSidebarOpen(o => !o)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        className="resume-content"
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-left 0.3s ease'
        }}
      >
        <h2>My Resume</h2>

        <section className="section personal">
          <label>
            Full Name
            <input
              value={resume.fullName}
              onChange={e => updateField('fullName', e.target.value)}
            />
          </label>
          <label>
            Email
            <input
              value={resume.email}
              onChange={e => updateField('email', e.target.value)}
            />
          </label>
          <label>
            Phone
            <input
              value={resume.phone}
              onChange={e => updateField('phone', e.target.value)}
            />
          </label>
        </section>

        <section className="section summary">
          <label>
            Professional Summary
            <textarea
              rows="4"
              value={resume.summary}
              onChange={e => updateField('summary', e.target.value)}
            />
          </label>
        </section>

        <section className="section list-section">
          <h3>Experience</h3>
          {resume.experiences.map(exp => (
            <div key={exp.id} className="list-item">
              <button
                className="remove-btn"
                onClick={() => removeListItem('experiences', exp.id)}
              >
                <FaTrashAlt />
              </button>

              <input
                placeholder="Job Title"
                value={exp.title}
                onChange={e => updateListItem('experiences', exp.id, 'title', e.target.value)}
              />
              <input
                placeholder="Company"
                value={exp.company}
                onChange={e => updateListItem('experiences', exp.id, 'company', e.target.value)}
              />
              <div className="dates">
                <input
                  type="month"
                  value={exp.from}
                  onChange={e => updateListItem('experiences', exp.id, 'from', e.target.value)}
                />
                <span>to</span>
                <input
                  type="month"
                  value={exp.to}
                  onChange={e => updateListItem('experiences', exp.id, 'to', e.target.value)}
                />
              </div>
              <textarea
                rows="2"
                placeholder="Description"
                value={exp.description}
                onChange={e => updateListItem('experiences', exp.id, 'description', e.target.value)}
              />
            </div>
          ))}
          <button className="add-btn" onClick={() => addListItem('experiences')}>
            <FaPlusCircle /> Add Experience
          </button>
        </section>

        <section className="section list-section">
          <h3>Education</h3>
          {resume.education.map(edu => (
            <div key={edu.id} className="list-item">
              <button
                className="remove-btn"
                onClick={() => removeListItem('education', edu.id)}
              >
                <FaTrashAlt />
              </button>

              <input
                placeholder="School"
                value={edu.school}
                onChange={e => updateListItem('education', edu.id, 'school', e.target.value)}
              />
              <input
                placeholder="Degree"
                value={edu.degree}
                onChange={e => updateListItem('education', edu.id, 'degree', e.target.value)}
              />
              <div className="dates">
                <input
                  type="month"
                  value={edu.from}
                  onChange={e => updateListItem('education', edu.id, 'from', e.target.value)}
                />
                <span>to</span>
                <input
                  type="month"
                  value={edu.to}
                  onChange={e => updateListItem('education', edu.id, 'to', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button className="add-btn" onClick={() => addListItem('education')}>
            <FaPlusCircle /> Add Education
          </button>
        </section>

        <button className="save-btn">
          <FaSave /> {resumeId ? 'Auto‑saved' : 'Saving…'}
        </button>
        <button
          className="preview-btn"
          onClick={() => navigate('/resume/preview')}
        >
          Preview Resume
        </button>
      </div>
    </div>
  );
}





