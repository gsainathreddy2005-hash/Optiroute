import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('optiroute_token', response.data.access_token);
      localStorage.setItem('optiroute_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('optiroute_token', response.data.access_token);
      localStorage.setItem('optiroute_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  getCurrentUser: async () => {
    const token = localStorage.getItem('optiroute_token');
    const response = await api.get('/auth/me', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('optiroute_token');
    localStorage.removeItem('optiroute_user');
  }
};
