import api from './api';

export const modelService = {
  getModels: async () => {
    const response = await api.get('/models');
    return response.data;
  },
  toggleModel: async (modelId, isActive) => {
    const response = await api.patch(`/models/${modelId}?is_active=${isActive}`);
    return response.data;
  }
};
