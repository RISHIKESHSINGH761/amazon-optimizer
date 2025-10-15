import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

export const optimizeAsin = (asin) =>
  axios.post(`${API_BASE}/optimize`, { asin });

export const fetchHistory = (asin) =>
  axios.get(`${API_BASE}/history/${asin}`);

export const fetchAll = () =>
  axios.get(`${API_BASE}/optimizations`);
