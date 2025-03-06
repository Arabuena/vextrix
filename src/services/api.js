import axios from 'axios';

const getBaseURL = () => {
  // Em produção, sempre usar o proxy
  if (window.location.hostname.includes('vercel.app')) {
    console.log('Ambiente de produção detectado, usando proxy');
    // Remover o /api da URL base pois será adicionado nas rotas
    return '';
  }
  
  // Em desenvolvimento local
  console.log('Ambiente de desenvolvimento detectado');
  return 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para logs e ajuste de URL
api.interceptors.request.use(
  config => {
    // Adiciona /api nas requisições em produção
    if (window.location.hostname.includes('vercel.app')) {
      config.url = '/api' + config.url;
    }
    
    console.log('API Request:', config.url);
    console.log('API Base URL:', config.baseURL);
    console.log('Full URL:', config.baseURL + config.url);
    const token = localStorage.getItem('token');
    console.log('Token sendo enviado:', token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status);
    return response;
  },
  error => {
    console.error('API Response Error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 