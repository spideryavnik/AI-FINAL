import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
});

export const login = (email, password) =>
  API.post('/auth/login', { email, password });

export const register = (user) =>
  API.post('/auth/register', user);

export const createSurvey = (survey, token) =>
  API.post('/surveys', survey, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const searchSurveys = (query, token) =>
  API.post('/search', { query }, {
    headers: { Authorization: `Bearer ${token}` },
  });
