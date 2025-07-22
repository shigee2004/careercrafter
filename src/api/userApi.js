import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',     // your json‑server URL
  headers: { 'Content-Type': 'application/json' }
});

export function registerUser(userData) {
  // userData = { fullName, email, password, role }
  return API.post('/users', userData);
}

// NEW: fetch users matching these credentials
export function loginUser({ email, password, role }) {
  return API.get('/users', {
    params: { email, password, role }
  });
}
// src/api/userApi.js
export function fetchJobs() {
  return API.get('/jobs');
}

export function fetchCompanies() {
  return API.get('/companies');
}
