import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
});

// fetch the current user's resume (if any)
export function fetchResume(userId) {
  return API.get('/resumes', { params: { userId } });
}

// create a new one
export function createResume(data) {
  return API.post('/resumes', data);
}

// update an existing one
export function updateResume(id, data) {
  return API.put(`/resumes/${id}`, data);
}
