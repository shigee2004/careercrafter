// src/api/resumeApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // or wherever your json‑server runs
  headers: { 'Content-Type': 'application/json' }
});

// fetch all for a user
export function fetchResume(userId) {
  return API.get('/resumes', { params: { userId } });
}

// NEW: fetch one by its auto‑generated id
export function fetchResumeById(id) {
  return API.get(`/resumes/${id}`);
}

export function createResume(data) {
  return API.post('/resumes', data);
}

export function updateResume(id, data) {
  return API.put(`/resumes/${id}`, data);
}

export function deleteResume(id) {
  return API.delete(`/resumes/${id}`);
}


