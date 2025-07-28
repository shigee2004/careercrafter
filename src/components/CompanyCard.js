import React, { useState } from 'react';
import {
  FaMapMarkerAlt,
  FaUsers,
  FaBuilding,
  FaChartLine,
  FaStar
} from 'react-icons/fa';
import './CompanyCard.css';

export default function CompanyCard({ company, jobsPosted }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="company-card">
        {/* Header: logo icon + name + rating */}
        <div className="company-card-header">
          <div className="company-logo">
            <FaBuilding size={32} color="#1976d2" />
          </div>
          <div className="company-title">
            <h3>{company.name}</h3>
            <p className="industry">{company.industry}</p>
          </div>
          <div className="company-rating">
            <FaStar /> {company.rating.toFixed(1)}
          </div>
        </div>

        {/* Description */}
        <p className="company-desc">
          {company.description || 
           'Leading company committed to excellence and innovation.'}
        </p>

        {/* Tags */}
        <div className="company-tags">
          {company.tags.map((t,i) => (
            <span className="company-tag" key={i}>{t}</span>
          ))}
        </div>

        {/* Meta info */}
        <div className="company-meta">
          <span><FaMapMarkerAlt className="icon-inline" /> {company.location}</span>
          <span><FaUsers className="icon-inline" /> {company.size}</span>
          <span><FaBuilding className="icon-inline" /> {company.industry}</span>
          <span><FaChartLine className="icon-inline" /> {jobsPosted ? `${jobsPosted} job${jobsPosted>1 ? 's' : ''} posted` : `${company.openRoles} open roles`}</span>
        </div>

        {/* Actions */}
        <div className="company-actions">
          <button className="btn-view">
            View Jobs ({jobsPosted || company.openRoles})
          </button>
          <button className="btn-profile" onClick={() => setShowModal(true)}>
            Company Profile
          </button>
        </div>
      </div>

      {/* Modal for Company Details */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(60,80,120,0.12)',
            zIndex: 99,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 32,
              borderRadius: 16,
              minWidth: 340,
              maxWidth: 470,
              boxShadow: '0 10px 36px rgba(60,90,130,0.18)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: 13,
                right: 18,
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
              }}
              aria-label="Close"
            >
              ×
            </button>
            <h2 style={{ marginTop: 0 }}>{company.name}</h2>
            <p><strong>Industry:</strong> {company.industry}</p>
            <p><strong>Location:</strong> {company.location}</p>
            <p><strong>Size:</strong> {company.size}</p>
            <p><strong>Rating:</strong> {company.rating.toFixed(1)}</p>
            <p><strong>Description:</strong> {company.description || "Leading company committed to excellence and innovation."}</p>
            {company.tags && (
              <div style={{ marginTop: 10 }}>
                <strong>Tags:</strong>
                <div style={{ marginTop: 4 }}>
                  {company.tags.map((t, i) => (
                    <span key={i} className="company-tag" style={{ marginRight: 7 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div style={{ marginTop: 14 }}>
              <strong>Open Roles:</strong> {company.openRoles}
            </div>
          </div>
        </div>
      )}
    </>
  );
}




