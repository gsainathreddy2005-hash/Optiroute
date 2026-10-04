import api from './api';

export const subscriptionService = {
  getPlans: async () => {
    const response = await api.get('/subscription/plans');
    return response.data;
  },
  upgradePlan: async (planTier) => {
    const response = await api.post('/subscription/upgrade', { plan_tier: planTier });
    return response.data;
  }
};
