import axios from 'axios';

const isProd = process.env.NODE_ENV === 'production';
const prodURL = 'https://bora-backend-5agl.onrender.com';
const devURL = 'http://localhost:5000';

const api = axios.create({
  baseURL: isProd ? prodURL : devURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Log de configuração
console.log('API Configuration:', {
  environment: process.env.NODE_ENV,
  baseURL: api.defaults.baseURL
});

// Interceptor para requisições
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    
    // Remove /api do início da URL se existir
    if (config.url?.startsWith('/api/')) {
      config.url = config.url.substring(4);
    }

    console.log('Making request:', {
      method: config.method,
      url: config.url,
      fullUrl: `${config.baseURL}${config.url}`,
      headers: config.headers
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

// Interceptor para respostas
api.interceptors.response.use(
  response => {
    console.log('Response Success:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      message: error.message
    });
    return Promise.r