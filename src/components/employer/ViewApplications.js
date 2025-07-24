// src/components/employer/ViewApplications.js
import React, { useEffect, useState } from 'react';
import { fetchApplications } from '../../api/applicationApi';
import EmployerLayout from '../../components/EmployerLayout';

export default function ViewApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    fetchApplications().then(r => setApps(r.data));
  }, []);

  return (
    <EmployerLayout>
      <h2>Incoming Applications</h2>
      {apps.length ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {apps.map(a => (
            <li
              key={a.id}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                borderRadius: '6px',
                background: '#fff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
            >
              <strong>{a.candidateName}</strong> applied for{' '}
              <em>{a.jobTitle}</em>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications yet.</p>
      )}
    </EmployerLayout>
  );
}


