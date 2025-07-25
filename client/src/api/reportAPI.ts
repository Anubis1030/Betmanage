import api from './axiosConfig';

export const ReportAPI = {
  createReport: (data: { type: 'withdrawal' | 'issue' | 'request'; description: string }) => 
    api.post('/reports', data),
  getReports: () => api.get('/reports'),
  updateReportStatus: (reportId: string, data: { status: 'pending' | 'resolved' | 'rejected' }) => 
    api.put(`/reports/${reportId}`, data),
};