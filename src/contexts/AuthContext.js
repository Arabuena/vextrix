import api from '../services/api';

const login = async (email, password) => {
  try {
    console.log('Tentando login:', { email });
    
    const response = await api.post('/auth/login', { 
      email, 
      password 
    });

    if (response.data.success) {
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw new Error('Erro ao fazer login');
  }
}; 