import api from './api';

export const cacheService = {
  getStats: async () => {
    const response = await api.get('/cache/stats');
    return response.data;
  },
  getEntries: async () => {
    const response = await api.get('/cache');
    return response.data;
  },
  clearCache: async () => {
    const response = await api.delete('/cache/clear');
    return response.data;
  },
  deleteKey: async (key) => {
    const response = await api.delete(`/cache/${encodeURIComponent(key)}`);
    return response.data;
  }
};
