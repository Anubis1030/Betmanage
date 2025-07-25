import api from './axiosConfig';

export const AdminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: (params = {}) => api.get('/admin/users', { params }),
  getRecentBets: (limit = 20) => api.get('/admin/bets/recent', { params: { limit } }),
  toggleUserBlock: (userId: string) => api.put(`/admin/users/${userId}/block`),
  generateSettlementReport: () => api.get('/admin/reports/settlement'),
};