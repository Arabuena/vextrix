import axios from 'axios';

const getBaseURL = () => {
  // Forçar uso do Render em todos os ambientes
  return 'https://bora-backend-5agl.onrender.com';
  
  /* Comentando a lógica anterior para debug
  try {
    if (import.meta.env?.PROD) {
      console.log('Ambiente de produção detectado, usando URL do Render');
      return 'https://bora-backend-5agl.onrender.com';
    }
    
    const envUrl = import.meta.env?.VITE_API_URL;
    if (envUrl) {
      console.log('Usando URL da variável de ambiente:', envUrl);
      return envUrl;
    }
    
    console.log('Usando URL local');
    return 'http://localhost:5000';
  } catch (error) {
    console.warn('Erro ao obter URL da API, usando URL do Render:', error);
    return 'https://bora-backend-5agl.onrender.com';
  }
  */
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
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