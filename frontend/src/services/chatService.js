import api from './api';

export const chatService = {
  createSession: async (title = "New Conversation") => {
    const response = await api.post('/chat/sessions', { title });
    return response.data;
  },
  getSessions: async () => {
    const response = await api.get('/chat/sessions');
    return response.data;
  },
  getSession: async (sessionId) => {
    const response = await api.get(`/chat/sessions/${sessionId}`);
    return response.data;
  },
  deleteSession: async (sessionId) => {
    const response = await api.delete(`/chat/sessions/${sessionId}`);
    return response.data;
  }
};
