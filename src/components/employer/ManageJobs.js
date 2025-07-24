// src/components/employer/ManageJobs.js
import React, { useEffect, useState } from 'react';
import { fetchJobs, deleteJob, updateJob } from '../../api/jobApi';
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes
} from 'react-icons/fa';
import EmployerLayout from '../../components/EmployerLayout';
import './ManageJobs.css';

export default function ManageJobs() {
  const [jobs, setJobs]           = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm]           = useState({
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    featured: false,
    postedAgo: ''
  });

  // load jobs once
  useEffect(() => {
    fetchJobs()
      .then(r => setJobs(r.data))
      .catch(console.error);
  }, []);

  // start editing a job
  function startEdit(job) {
    setEditingId(job.id);
    setForm({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      description: job.description,
      featured: job.featured,
      postedAgo: job.postedAgo || ''
    });
  }

  // handle input changes
  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  // save edits via PUT
  async function saveEdit(id) {
    try {
      const res = await updateJob(id, form);
      setJobs(js => js.map(j => (j.id === id ? res.data : j)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    }
  }

  // cancel edit mode
  function cancelEdit() {
    setEditingId(null);
  }

  // delete a job
  function handleDelete(id) {
    if (!window.confirm('Delete this job?')) return;
    deleteJob(id)
      .then(() => setJobs(js => js.filter(j => j.id !== id)))
      .catch(console.error);
  }

  return (
    <EmployerLayout>
      <h2 className="page-header">Manage Your Jobs</h2>

      {jobs.length === 0 && (
        <p className="empty-msg">You haven’t posted any jobs yet.</p>
      )}

      <ul className="jobs-list">
        {jobs.map(job => (
          <li key={job.id} className="job-card">
            {editingId === job.id ? (
              <div className="job-edit-form">
                <input
                  name="title"
                  value={form.title}
                  onChange={onChange}
                  placeholder="Job Title"
                />
                <input
                  name="company"
                  value={form.company}
                  onChange={onChange}
                  placeholder="Company"
                />
                <input
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  placeholder="Location"
                />
                <select name="type" value={form.type} onChange={onChange}>
                  <option value="">Job Type…</option>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Internship</option>
                </select>
                <textarea
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={onChange}
                  placeholder="Description"
                />
                <div className="form-actions">
                  <button
                    className="btn btn-save"
                    onClick={() => saveEdit(job.id)}
                  >
                    <FaSave /> Save
                  </button>
                  <button
                    className="btn btn-cancel"
                    onClick={cancelEdit}
                  >
                    <FaTimes /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="job-view">
                <h3>{job.title}</h3>
                <p className="meta">
                  {job.company} · {job.location} · {job.type}
                </p>
                <p className="description">{job.description}</p>
                <div className="view-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => startEdit(job)}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(job.id)}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </EmployerLayout>
  );
}





