import axios from 'axios';
const API_BASE = 'https://amazon-optimizer-production.up.railway.app/api';

export const optimizeAsin = (asin) =>
  axios.post(`${API_BASE}/optimize`, { asin });

export const fetchHistory = (asin) =>
  axios.get(`${API_BASE}/history/${asin}`);

export const fetchAll = () =>
  axios.get(`${API_BASE}/optimizations`);
