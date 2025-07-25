import api from './axiosConfig';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
  phone?: string;
}

export const AuthAPI = {
  login: (data: LoginData) => api.post('/users/login', data),
  register: (data: RegisterData) => api.post('/users', data),
  getProfile: () => api.get('/users/profile'),
  getStats: (userId: string) => api.get(`/users/${userId}/stats`),
  getActivity: (userId: string) => api.get(`/users/${userId}/activity`),
  getTransactions: (userId: string) => api.get(`/users/${userId}/transactions`),
  getNotifications: (userId: string) => api.get(`/users/${userId}/notifications`),
};