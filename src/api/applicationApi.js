// src/api/applicationApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
});

export function fetchApplications() {
  return API.get('/applications');
}

export function createApplication(appData) {
  return API.post('/applications', appData);
}
