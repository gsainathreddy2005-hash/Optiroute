import api from './api';

export const analyticsService = {
  getOverview: async () => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },
  getRecentRequests: async (limit = 20) => {
    const response = await api.get(`/analytics/recent-requests?limit=${limit}`);
    return response.data;
  }
};
