// src/api/profileApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' }
});

// fetch profile for a given userId (assumes your db.json has a "profiles" array)
export function fetchProfile(userId) {
  return API.get('/profiles', { params: { userId } });
}

// create a brand‑new profile
export function createProfile(data) {
  return API.post('/profiles', data);
}

// update an existing profile by its id
export function updateProfile(id, data) {
  return API.put(`/profiles/${id}`, data);
}
