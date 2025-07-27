// src/components/employer/ViewApplications.js
import React, { useEffect, useState } from 'react';
import { fetchApplications } from '../../api/applicationApi';
import EmployerLayout from '../../components/EmployerLayout';

export default function ViewApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApplications()
      .then(r => setApps(r.data))
      .catch(console.error);
  }, []);

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
              <h3 style={{ margin: 0 }}>{app.candidateName}</h3>
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Email:</strong> {app.candidateEmail}
                <br />
                <strong>Phone:</strong> {app.candidatePhone}
              </p>
              <a
                href={`http://localhost:8000/${app.resumeFileName}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
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









