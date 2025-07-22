import React from 'react';
import './JobCard.css';

export default function JobCard({ job }) {
  // optional: truncate long descriptions
  const desc = job.description.length > 120
    ? job.description.slice(0, 120) + '…'
    : job.description;

  return (
    <div className="job-card">
      <h2>{job.title}</h2>
      <p className="company"><strong>Company:</strong> {job.company}</p>
      <p className="location"><strong>Location:</strong> {job.location}</p>
      <p className="description">{desc}</p>
      <button className="apply-btn">Apply Now</button>
    </div>
  );
}


