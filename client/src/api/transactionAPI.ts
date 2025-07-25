import api from './axiosConfig';

export const TransactionAPI = {
  adjustUserCoins: (data: { userId: string; type: 'credit' | 'debit'; amount: number; reason: string }) => 
    api.post('/transactions/adjust', data),
  getUserTransactions: (userId: string) => api.get(`/transactions/user/${userId}`),
};