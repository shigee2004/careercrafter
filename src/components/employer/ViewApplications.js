import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchApplications } from '../../api/applicationApi';
import EmployerLayout from '../../components/EmployerLayout';

export default function ViewApplications() {
  const [apps, setApps] = useState([]);
  const [jobs, setJobs] = useState([]); // <-- added
  const [statusMap, setStatusMap] = useState({});
  const [saving, setSaving] = useState({});

  useEffect(() => {
    fetchApplications()
      .then(r => {
        setApps(r.data);
        const initStatus = {};
        r.data.forEach(app => {
          initStatus[app.id] = app.status || 'Submitted';
        });
        setStatusMap(initStatus);
      })
      .catch(console.error);

    // Fetch jobs for job titles
    axios.get('http://localhost:8000/jobs')
      .then(res => setJobs(res.data))
      .catch(console.error);
  }, []);

  function getJobTitle(jobId) {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : "Unknown Role";
  }

  function handleStatusChange(appId, status) {
    setStatusMap(prev => ({ ...prev, [appId]: status }));
  }

  function saveStatus(appId) {
    setSaving(prev => ({ ...prev, [appId]: true }));
    axios.patch(`http://localhost:8000/applications/${appId}`, {
      status: statusMap[appId],
      notified: false
    }).then(() => {
      // Optionally refresh apps or show a toast
    }).finally(() => {
      setSaving(prev => ({ ...prev, [appId]: false }));
    });
  }

  return (
    <EmployerLayout>
      <h2>Incoming Applications</h2>

      {apps.length ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {apps.map(app => (
            <li
              key={app.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '6px',
                background: '#fff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              {/* Flex container for details and status */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16
              }}>
                <div>
                  <h3 style={{ margin: 0 }}>{app.candidateName}</h3>
                  <p style={{ margin: '0.25rem 0' }}>
                    <strong>Email:</strong> {app.candidateEmail}
                    <br />
                    <strong>Phone:</strong> {app.candidatePhone}
                    <br />
                    <strong>Applied For:</strong> {getJobTitle(app.jobId)}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <select
                    value={statusMap[app.id] || 'Submitted'}
                    onChange={e => handleStatusChange(app.id, e.target.value)}
                    style={{ padding: '0.5rem', borderRadius: 4 }}
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => saveStatus(app.id)}
                    disabled={saving[app.id]}
                    style={{
                      background: '#0069d9',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      padding: '0.5rem 1rem',
                      cursor: 'pointer'
                    }}
                  >
                    {saving[app.id] ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>

              {/* View Resume button below */}
              <a
                href={`http://localhost:8000/${app.resumeFileName}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#007bff',
                  color: '#fff',
                  borderRadius: '4px',
                  textDecoration: 'none'
                }}
              >
                View Resume
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications yet.</p>
      )}
    </EmployerLayout>
  );
}












