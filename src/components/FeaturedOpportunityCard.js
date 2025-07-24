// src/components/FeaturedOpportunityCard.js
import React from 'react';
import {
  FaBuilding,
  FaStar,
  FaUsers,
  FaMapMarkerAlt,
  FaClock,
  FaDollarSign,
  FaBookmark
} from 'react-icons/fa';
import './FeaturedOpportunityCard.css';

export default function FeaturedOpportunityCard({ job }) {
  // fall back to an empty array if job.tags is missing or not an array
  const tags = Array.isArray(job.tags) ? job.tags : [];

  return (
    <div className="feat-card">
      {/* Left side: logo, title, badge, bookmark */}
      <div className="feat-card-left">
        <div className="feat-header">
          <FaBuilding className="feat-logo" size={28} />
          <h3 className="feat-title">{job.title}</h3>
          <span className="feat-badge">Featured</span>
          <FaBookmark className="feat-bookmark" />
        </div>

        <div className="feat-subheader">
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
          <span>• {job.postedAgo || '2 days ago'}</span>
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
        <button className="btn-apply">Apply Now</button>
        <button className="btn-details">View Details</button>
      </div>
    </div>
  );
}


