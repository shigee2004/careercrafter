// src/api/jobApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',   // <-- must match your json-server port
  headers: { 'Content-Type': 'application/json' }
});

export function fetchJobs() {
  return API.get('/jobs');
}

export function createJob(jobData) {
  return API.post('/jobs', jobData);
}

export function updateJob(id, jobData) {
  return API.put(`/jobs/${id}`, jobData);
}

export function deleteJob(id) {
  return API.delete(`/jobs/${id}`);
}



