import axios from 'axios';

const getBaseURL = () => {
  // Para debug
  console.log('Variáveis de ambiente:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE
  });
  
  const envUrl = import.meta.env?.VITE_API_URL;
  if (!envUrl) {
    console.warn('VITE_API_URL não encontrada no ambiente. Usando URL padrão.');
    // Apontando direto para o Render em produção
    return import.meta.env.PROD 
      ? 'https://bora-backend-5agl.onrender.com'
      : 'http://localhost:5000/api';
  }
  return envUrl;
};

const api = axios.create({
  baseURL: getBaseURL()
});

// Interceptor para logs
api.interceptors.request.use(
  config => {
    console.log('API Request:', config.url);
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