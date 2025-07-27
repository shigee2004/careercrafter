// src/api/applicationApi.js
import axios from 'axios';

const BASE = 'http://localhost:8000';

/**
 * Submit a new application.
 * @param {Object} data  { jobId, candidateId, resumeUrl, coverLetter, ... }
 */
export function applyForJob(data) {
  return axios.post(`${BASE}/applications`, data);
}

/**
 * Alias for createApplication; you can import this if you prefer that naming.
 */
export const createApplication = applyForJob;

/**
 * For employers: fetch all applications submitted to this company.
 */
export function fetchApplications() {
  const companyId = localStorage.getItem('companyId');
  return axios.get(`${BASE}/applications?companyId=${companyId}`);
}

