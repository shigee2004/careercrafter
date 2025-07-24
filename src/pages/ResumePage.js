// src/pages/ResumePage.js
import React, { useState, useEffect } from 'react';
import {
  FaSave,
  FaPlusCircle,
  FaTrashAlt,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import {
  fetchResume,
  createResume,
  updateResume,
  deleteResume
} from '../api/resumeApi';
import './ResumePage.css';

const SIDEBAR_WIDTH = 220;

const BLANK = {
  fullName: '',
  email: '',
  phone: '',
  summary: '',
  experiences: [],
  education: [],
  resumeFile: null
};

export default function ResumePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resume, setResume]           = useState(BLANK);
  const [resumeId, setResumeId]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [showPdf, setShowPdf]         = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const userId = localStorage.getItem('userId');

  // 1) Load or seed
  useEffect(() => {
    if (!userId) return;
    fetchResume(userId)
      .then(res => {
        const arr = res.data;
        if (arr.length > 0) {
          setResume(arr[0]);
          setResumeId(arr[0].id);
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

  // 2) Auto‑save
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

  // 3) Field & list helpers
  const updateField = (k,v) =>
    setResume(r => ({ ...r, [k]: v }));

  const updateListItem = (list, id, k, v) =>
    setResume(r => ({
      ...r,
      [list]: r[list].map(item =>
        item.id === id ? { ...item, [k]: v } : item
      )
    }));

  const addListItem = list => {
    const newItem = list === 'experiences'
      ? { id: Date.now(), title:'',company:'',from:'',to:'',description:'' }
      : { id: Date.now(), school:'',degree:'',from:'',to:'' };
    setResume(r => ({ ...r, [list]: [...r[list], newItem] }));
  };

  const removeListItem = (list, id) =>
    setResume(r => ({
      ...r,
      [list]: r[list].filter(item => item.id !== id)
    }));

  // 4) Delete
  const handleDelete = () => {
    if (!resumeId) return;
    deleteResume(resumeId)
      .then(() => {
        setResume(BLANK);
        setResumeId(null);
        setShowPdf(false);
        setShowPreview(false);
      })
      .catch(console.error);
  };

  if (loading) {
    return <p style={{ padding:'2rem' }}>Loading…</p>;
  }

  return (
    <div className="resume-root">
      <Navbar onMenuClick={()=>setSidebarOpen(o=>!o)} />
      <Sidebar isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)} />

      <div
        className="resume-content"
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-left 0.3s ease'
        }}
      >
        <h2>My Resume</h2>

        {/* ==== PDF Attach/View/Remove ==== */}
        <section className="section file-upload">
          <label>
            Attach PDF:
            <input
              type="file"
              accept="application/pdf"
              onChange={e => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  setResume(r => ({ ...r, resumeFile: reader.result }));
                  setShowPdf(false);
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          {resume.resumeFile && (
            <div className="file-links">
              <button
                className="view-btn"
                onClick={()=>setShowPdf(v=>!v)}
              >
                {showPdf ? 'Hide Attached Resume' : 'View Attached Resume'}
              </button>
              <button
                className="remove-btn"
                onClick={()=>setResume(r => ({ ...r, resumeFile: null }))}
              >
                Remove Attachment
              </button>
            </div>
          )}
          {showPdf && (
            <div className="pdf-preview">
              <iframe
                src={resume.resumeFile}
                width="100%"
                height="400"
                title="Resume PDF"
              />
            </div>
          )}
        </section>

        {/* ==== Actions: Save / Delete / Preview Toggle ==== */}
        <div className="actions-row">
          <button className="save-btn">
            <FaSave /> {resumeId ? 'Auto‑saved' : 'Saving…'}
          </button>
          {resumeId && (
            <button className="delete-btn" onClick={handleDelete}>
              <FaTrashAlt /> Delete Resume
            </button>
          )}
          <button
            className="preview-btn"
            onClick={()=>setShowPreview(p => !p)}
          >
            {showPreview
              ? <><FaEyeSlash/> Hide Preview</>
              : <><FaEye/> Show Preview</>
            }
          </button>
        </div>

        {/* ==== Editable Form ==== */}
        <section className="section personal">
          <label>
            Full Name
            <input
              value={resume.fullName}
              onChange={e=>updateField('fullName', e.target.value)}
            />
          </label>
          <label>
            Email
            <input
              value={resume.email}
              onChange={e=>updateField('email', e.target.value)}
            />
          </label>
          <label>
            Phone
            <input
              value={resume.phone}
              onChange={e=>updateField('phone', e.target.value)}
            />
          </label>
        </section>

        <section className="section summary">
          <label>
            Professional Summary
            <textarea
              rows="4"
              value={resume.summary}
              onChange={e=>updateField('summary', e.target.value)}
            />
          </label>
        </section>

        <section className="section list-section">
          <h3>Experience</h3>
          {resume.experiences.map(exp=>(
            <div key={exp.id} className="list-item">
              <button
                className="remove-btn"
                onClick={()=>removeListItem('experiences',exp.id)}
              >
                <FaTrashAlt/>
              </button>
              <input
                placeholder="Job Title"
                value={exp.title}
                onChange={e=>updateListItem('experiences',exp.id,'title',e.target.value)}
              />
              <input
                placeholder="Company"
                value={exp.company}
                onChange={e=>updateListItem('experiences',exp.id,'company',e.target.value)}
              />
              <div className="dates">
                <input
                  type="month"
                  value={exp.from}
                  onChange={e=>updateListItem('experiences',exp.id,'from',e.target.value)}
                />
                <span>to</span>
                <input
                  type="month"
                  value={exp.to}
                  onChange={e=>updateListItem('experiences',exp.id,'to',e.target.value)}
                />
              </div>
              <textarea
                rows="2"
                placeholder="Description"
                value={exp.description}
                onChange={e=>updateListItem('experiences',exp.id,'description',e.target.value)}
              />
            </div>
          ))}
          <button className="add-btn" onClick={()=>addListItem('experiences')}>
            <FaPlusCircle/> Add Experience
          </button>
        </section>

        <section className="section list-section">
          <h3>Education</h3>
          {resume.education.map(edu=>(
            <div key={edu.id} className="list-item">
              <button
                className="remove-btn"
                onClick={()=>removeListItem('education',edu.id)}
              >
                <FaTrashAlt/>
              </button>
              <input
                placeholder="School"
                value={edu.school}
                onChange={e=>updateListItem('education',edu.id,'school',e.target.value)}
              />
              <input
                placeholder="Degree"
                value={edu.degree}
                onChange={e=>updateListItem('education',edu.id,'degree',e.target.value)}
              />
              <div className="dates">
                <input
                  type="month"
                  value={edu.from}
                  onChange={e=>updateListItem('education',edu.id,'from',e.target.value)}
                />
                <span>to</span>
                <input
                  type="month"
                  value={edu.to}
                  onChange={e=>updateListItem('education',edu.id,'to',e.target.value)}
                />
              </div>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addListItem('education')}>
            <FaPlusCircle/> Add Education
          </button>
        </section>

        {/* ==== Conditional Preview Template ==== */}
        {showPreview && (
          <div className="resume-template">
            <h2>Resume Preview</h2>
            <header className="template-header">
              <h1>{resume.fullName || 'Your Name'}</h1>
              <p>
                {resume.email || 'email@example.com'}
                {resume.phone ? ` | ${resume.phone}` : ''}
              </p>
            </header>

            <section className="template-section">
              <h3>Professional Summary</h3>
              <p>{resume.summary || 'A brief summary...'}</p>
            </section>

            <section className="template-section">
              <h3>Experience</h3>
              {resume.experiences.length>0 ? (
                resume.experiences.map(exp=>(
                  <div key={exp.id} className="resume-item">
                    <strong>{exp.title || 'Job Title'}</strong>, {exp.company || 'Company'}
                    <span className="dates">
                      {exp.from || '--'} – {exp.to || '--'}
                    </span>
                    <p>{exp.description || 'Describe your role...'}</p>
                  </div>
                ))
              ) : <p><em>No entries</em></p>}
            </section>

            <section className="template-section">
              <h3>Education</h3>
              {resume.education.length>0 ? (
                resume.education.map(edu=>(
                  <div key={edu.id} className="resume-item">
                    <strong>{edu.degree || 'Degree'}</strong>, {edu.school || 'School'}
                    <span className="dates">
                      {edu.from || '--'} – {edu.to || '--'}
                    </span>
                  </div>
                ))
              ) : <p><em>No entries</em></p>}
            </section>

            {resume.resumeFile && (
              <section className="template-section">
                <h3>Attached PDF</h3>
                <iframe
                  src={resume.resumeFile}
                  width="100%"
                  height="300"
                  title="Attached Resume"
                  style={{ border:'1px solid #ccc' }}
                />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}













