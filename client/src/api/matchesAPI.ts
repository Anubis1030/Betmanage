import api from './axiosConfig';

export const MatchesAPI = {
  getActiveMatches: () => api.get('/matches/active'),
  getMatchById: (id: string) => api.get(`/matches/${id}`),
  getCompletedMatches: () => api.get('/matches/completed'),
  getUpcomingMatches: () => api.get('/matches/upcoming'),
  createMatch: (matchData: any) => api.post('/matches', matchData),
  updateMatch: (id: string, matchData: any) => api.put(`/matches/${id}`, matchData),
  lockMatch: (id: string) => api.put(`/matches/${id}/lock`),
  setMatchResult: (id: string, resultData: { winner: string; teamAScore: number; teamBScore: number }) => 
    api.put(`/matches/${id}/result`, resultData),
};