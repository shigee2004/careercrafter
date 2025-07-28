// src/components/FeaturedOpportunityCard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaBuilding,
  FaStar,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
} from 'react-icons/fa';
import './FeaturedOpportunityCard.css';

// Utility to show "x days ago"
function daysAgo(dateStr) {
  if (!dateStr) return '';
  const posted = new Date(dateStr);
  const now = new Date();
  // get midnight time
  posted.setHours(0,0,0,0);
  now.setHours(0,0,0,0);
  const diffTime = now - posted;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  return `${diffDays} days ago`;
}

export default function FeaturedOpportunityCard({ job }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  // ensure tags is always an array
  const tags = Array.isArray(job.tags) ? job.tags : [];

  return (
    <>
      <div className="feat-card">
        {/* Left side: logo, title, badge */}
        <div className="feat-card-left">
          <div className="feat-header">
            <FaBuilding className="feat-logo" size={28} />
            <h3 className="feat-title">{job.title}</h3>
            {job.featured && (
              <span className="feat-badge">Featured</span>
            )}
          </div>

          <div className="feat-subheader">
            {/* <-- This shows the company name */}
            <span className="company-name">{job.company}</span>
            <FaStar className="icon-inline" /> {job.rating || '4.8'}
            &nbsp;•&nbsp;
            <FaUsers className="icon-inline" /> {job.teamSize || '500‑1000'}
          </div>

          <div className="feat-meta">
            <span>
              <FaMapMarkerAlt className="icon-inline" /> {job.location}
            </span>
            <span>
              <FaClock className="icon-inline" /> {job.type || 'Full‑time'}
            </span>
            <span>
              <FaDollarSign className="icon-inline" /> {job.salary || '$120k‑$160k'}
            </span>
            <span>• {daysAgo(job.postedAt)}</span>
          </div>

          <p className="feat-desc">{job.description}</p>

          <div className="feat-tags">
            {tags.map((t, i) => (
              <span key={i} className="feat-tag">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right side: action buttons */}
        <div className="feat-card-right">
          <button
            className="btn-apply"
            onClick={() => navigate(`/apply/${job.id}`)}
          >
            Apply Now
          </button>
          <button
            className="btn-details"
            onClick={() => setShowModal(true)}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Modal for Job Details */}
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
            <h2 style={{ marginTop: 0 }}>{job.title}</h2>
            {/* <-- Company name visible in modal as well */}
            <p><strong>Company:</strong> {job.company}</p>
            <p><strong>Location:</strong> {job.location}</p>
            <p><strong>Type:</strong> {job.type}</p>
            {job.salary && <p><strong>Salary:</strong> {job.salary}</p>}
            {job.postedAt && <p><strong>Posted:</strong> {daysAgo(job.postedAt)}</p>}
            <div style={{ marginTop: 14 }}>
              <strong>Description:</strong>
              <div style={{ marginTop: 7 }}>{job.description}</div>
            </div>
            {tags.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <strong>Tags:</strong>
                <div style={{ marginTop: 5 }}>
                  {tags.map((t, i) => (
                    <span key={i} className="feat-tag" style={{ marginRight: 7 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}







