import axios from 'axios';

const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    console.log('Ambiente de produção detectado');
    return 'https://bora-backend-5agl.onrender.com';
  }
  
  console.log('Ambiente de desenvolvimento detectado');
  return 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Interceptor para logs e ajuste de URL
api.interceptors.request.use(
  config => {
    // Remove /api do início da URL se existir
    if (config.url?.startsWith('/api/')) {
      config.url = config.url.substring(4);
    }
    
    console.log('Request:', {
      method: config.method,
      url: config.url,
      fullUrl: `${config.baseURL}${config.url}`,
      data: config.data
    });
    
    const token = localStorage.getItem('token');
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
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 