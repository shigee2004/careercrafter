// src/api/userApi.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000',     // your json‑server URL
  headers: { 'Content-Type': 'application/json' }
});

/**
 * Register a new user
 * @param {{ fullName:string, email:string, password:string, role:string }} userData
 */
export function registerUser(userData) {
  return API.post('/users', userData);
}

/**
 * Login: fetch users matching these credentials
 * @param {{ email:string, password:string, role:string }} credentials
 */
export function loginUser({ email, password, role }) {
  return API.get('/users', {
    params: { email, password, role }
  });
}

/**
 * Fetch all jobs
 */
export function fetchJobs() {
  return API.get('/jobs');
}

/**
 * Fetch all companies
 */
export function fetchCompanies() {
  return API.get('/companies');
}

/**
 * === New Profile endpoints ===
 */

/**
 * Get the current user’s profile by ID
 * @param {string} userId
 */
export function getProfile(userId) {
  return API.get(`/users/${userId}`);
}

/**
 * Update the current user’s profile by ID
 * @param {string} userId
 * @param {{ fullName:string, email:string, password?:string, phone?:string, role:string }} payload
 */
export function updateProfile(userId, payload) {
  return API.put(`/users/${userId}`, payload);
}

