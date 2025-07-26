import api from './axiosConfig';
import { Bet } from '../types/apitypes';

export const BetsAPI = {
  getUserBets: (userId: string) => api.get(`/bets/user/${userId}`),
  placeBet: (betData: Omit<Bet, '_id' | 'status'>) => api.post('/bets', betData),
  getAllBets: () => api.get('/bets'),
  processBets: () => api.post('/bets/process'),
};
