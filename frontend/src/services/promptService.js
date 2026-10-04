import api from './api';

export const promptService = {
  processPrompt: async (data) => {
    const response = await api.post('/prompt/process', data);
    return response.data;
  },
  getRequestById: async (requestId) => {
    const response = await api.get(`/prompt/${requestId}`);
    return response.data;
  },
  submitFeedback: async (feedbackData) => {
    const response = await api.post('/feedback', feedbackData);
    return response.data;
  },
  getFeedback: async () => {
    const response = await api.get('/feedback');
    return response.data;
  },
  testRouting: async (prompt) => {
    const response = await api.post('/routing/test', { prompt });
    return response.data;
  }
};
