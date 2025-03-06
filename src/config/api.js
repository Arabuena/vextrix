const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = {
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

console.log('API Config:', {
  baseURL: api.baseURL,
  env: process.env.NODE_ENV
});

export default api; 