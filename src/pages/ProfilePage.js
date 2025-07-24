// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaPlusCircle, FaSave } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { fetchProfile, createProfile, updateProfile } from '../api/profileApi';
import './ProfilePage.css';

const SIDEBAR_WIDTH = 220;
const BLANK_PROFILE = {
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  education: {
    tenth:   { school:'', year:'', marks:'' },
    twelfth: { school:'', year:'', marks:'' },
    college: { name:'', year:'', marks:'' }
  },
  skills: [],
  certifications: [],
  internships: []
};

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userId = localStorage.getItem('userId');
  const [profile, setProfile] = useState(BLANK_PROFILE);
  const [profileId, setProfileId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 1) load existing or seed blank
  useEffect(() => {
    if (!userId) return;
    fetchProfile(userId)
      .then(res => {
        const arr = res.data;
        if (arr.length > 0) {
          setProfile(arr[0]);
          setProfileId(arr[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  // field updater
  const updateField = (key, val) => {
    setProfile(p => ({ ...p, [key]: val }));
  };

  // nested education updater
  const updateEdu = (section, key, val) => {
    setProfile(p => ({
      ...p,
      education: {
        ...p.education,
        [section]: {
          ...p.education[section],
          [key]: val
        }
      }
    }));
  };

  // add/remove skills & certifications
  const addTag = list => {
    setProfile(p => ({ ...p, [list]: [...p[list], ''] }));
  };
  const updateTag = (list, idx, val) => {
    setProfile(p => {
      const copy = [...p[list]];
      copy[idx] = val;
      return { ...p, [list]: copy };
    });
  };
  const removeTag = (list, idx) => {
    setProfile(p => {
      const copy = p[list].filter((_, i) => i !== idx);
      return { ...p, [list]: copy };
    });
  };

  // internships CRUD in-state
  const addIntern = () => {
    setProfile(p => ({
      ...p,
      internships: [
        ...p.internships,
        { id: Date.now(), company:'', role:'', from:'', to:'', description:'' }
      ]
    }));
  };
  const updateIntern = (id, key, val) => {
    setProfile(p => ({
      ...p,
      internships: p.internships.map(i =>
        i.id === id ? { ...i, [key]: val } : i
      )
    }));
  };
  const removeIntern = id => {
    setProfile(p => ({
      ...p,
      internships: p.internships.filter(i => i.id !== id)
    }));
  };

  // when user clicks Save
  const handleSave = () => {
    const payload = { ...profile, userId };
    const action = profileId
      ? updateProfile(profileId, payload)
      : createProfile(payload);

    action
      .then(res => {
        if (!profileId) setProfileId(res.data.id);
        setMessage('Profile saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      })
      .catch(err => {
        console.error(err);
        setMessage('Error saving profile.');
      });
  };

  if (loading) return <p style={{ padding:'2rem' }}>Loading…</p>;

  return (
    <div className="profile-root">
      <Navbar onMenuClick={()=>setSidebarOpen(o=>!o)} />
      <Sidebar isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)} />

      <div
        className="profile-content"
        style={{
          marginLeft: sidebarOpen ? SIDEBAR_WIDTH : 0,
          transition: 'margin-left 0.3s ease'
        }}
      >
        <h2>My Profile</h2>
        {message && <p className="status-msg">{message}</p>}

        {/* Personal */}
        <section className="section personal">
          <label>Full Name<input
            value={profile.fullName}
            onChange={e=>updateField('fullName', e.target.value)}
          /></label>
          <label>Email<input
            type="email"
            value={profile.email}
            onChange={e=>updateField('email', e.target.value)}
          /></label>
          <label>Phone<input
            value={profile.phone}
            onChange={e=>updateField('phone', e.target.value)}
          /></label>
          <label>Date of Birth<input
            type="date"
            value={profile.dob}
            onChange={e=>updateField('dob', e.target.value)}
          /></label>
        </section>

        {/* Education */}
        <section className="section list-section">
          <h3>Education</h3>
          {['tenth','twelfth','college'].map(sectionKey => {
            const title = sectionKey==='tenth'
              ? '10th Grade'
              : sectionKey==='twelfth'
                ? '12th Grade'
                : 'College';
            const edu = profile.education[sectionKey];
            return (
              <div key={sectionKey} className="edu-group">
                <h4>{title}</h4>
                <input
                  placeholder={ sectionKey==='college' ? 'College Name' : 'School Name' }
                  value={edu[ sectionKey==='college' ? 'name' : 'school' ]}
                  onChange={e=>updateEdu(
                    sectionKey,
                    sectionKey==='college' ? 'name' : 'school',
                    e.target.value
                  )}
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={edu.year}
                  onChange={e=>updateEdu(sectionKey,'year',e.target.value)}
                />
                <input
                  placeholder="Marks (%)"
                  value={edu.marks}
                  onChange={e=>updateEdu(sectionKey,'marks',e.target.value)}
                />
              </div>
            );
          })}
        </section>

        {/* Professional */}
        <section className="section list-section">
          <h3>Skills</h3>
          {profile.skills.map((skill, idx) => (
            <div key={idx} className="tag-input">
              <input
                placeholder="Skill"
                value={skill}
                onChange={e=>updateTag('skills', idx, e.target.value)}
              />
              <button onClick={()=>removeTag('skills', idx)}><FaTrashAlt/></button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addTag('skills')}>
            <FaPlusCircle/> Add Skill
          </button>

          <h3>Certifications</h3>
          {profile.certifications.map((cert, idx) => (
            <div key={idx} className="tag-input">
              <input
                placeholder="Certification"
                value={cert}
                onChange={e=>updateTag('certifications', idx, e.target.value)}
              />
              <button onClick={()=>removeTag('certifications', idx)}><FaTrashAlt/></button>
            </div>
          ))}
          <button className="add-btn" onClick={()=>addTag('certifications')}>
            <FaPlusCircle/> Add Certification
          </button>
        </section>

        {/* Internships */}
        <section className="section list-section">
          <h3>Internships</h3>
          {profile.internships.map(i => (
            <div key={i.id} className="list-item">
              <button className="remove-btn" onClick={()=>removeIntern(i.id)}>
                <FaTrashAlt/>
              </button>
              <input
                placeholder="Company"
                value={i.company}
                onChange={e=>updateIntern(i.id,'company', e.target.value)}
              />
              <input
                placeholder="Role"
                value={i.role}
                onChange={e=>updateIntern(i.id,'role', e.target.value)}
              />
              <div className="dates">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={i.from}
                  onChange={e=>updateIntern(i.id,'from', e.target.value)}
                />
                <span>to</span>
                <input
                  type="date"
                  placeholder="End Date"
                  value={i.to}
                  onChange={e=>updateIntern(i.id,'to', e.target.value)}
                />
              </div>
              <textarea
                rows="2"
                placeholder="Description"
                value={i.description}
                onChange={e=>updateIntern(i.id,'description', e.target.value)}
              />
            </div>
          ))}
          <button className="add-btn" onClick={addIntern}>
            <FaPlusCircle/> Add Internship
          </button>
        </section>

        {/* Save Button */}
        <button className="save-btn" onClick={handleSave}>
          <FaSave/> Save Profile
        </button>
      </div>
    </div>
  );
}

