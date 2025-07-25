import api from './axiosConfig';

export const BetsAPI = {
  getUserBets: (userId: string) => api.get(`/bets/user/${userId}`),
  placeBet: (betData: any) => api.post('/bets', betData),
  getAllBets: () => api.get('/bets'),
  processBets: () => api.post('/bets/process'),
};
