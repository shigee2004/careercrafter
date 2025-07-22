import React from 'react';
import {
  FaMapMarkerAlt,
  FaUsers,
  FaBuilding,
  FaChartLine,
  FaStar
} from 'react-icons/fa';
import './CompanyCard.css';

export default function CompanyCard({ company }) {
  return (
    <div className="company-card">
      {/* Header: logo icon + name + rating */}
      <div className="company-card-header">
        <div className="company-logo">
          {/* You can swap this for an <img> if you have a URL */}
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
        <span><FaChartLine className="icon-inline" /> {company.openRoles} open roles</span>
      </div>

      {/* Actions */}
      <div className="company-actions">
        <button className="btn-view">
          View Jobs ({company.openRoles})
        </button>
        <button className="btn-profile">
          Company Profile
        </button>
      </div>
    </div>
  );
}

