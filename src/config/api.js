import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';
const prodURL = 'https://bora-backend-5agl.onrender.com';
const devURL = 'http://localhost:5000';

console.log('Environment:', process.env.NODE_ENV);
console.log('Using URL:', isProd ? prodURL : devURL);

const api = axios.create({
  baseURL: isProd ? prodURL : devURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para adicionar o token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    // Log para debug
    console.log('Request Config:', {
      method: config.method,
      url: `${config.baseURL}${config.url}`,
      headers: config.headers,
      hasToken: !!token
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros
api.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    
    return Promise.reject(error);
  }
);

export default api; 