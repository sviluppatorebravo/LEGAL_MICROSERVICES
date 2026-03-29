import axios from 'axios';
const apiClient = axios.create({ baseURL: '/api' });
apiClient.interceptors.response.use((r) => r, (error) => {
  if (error.response) { const d = error.response.data;
    if (d?.code === 'SERVICE_UNAVAILABLE' || d?.code === 'SERVICE_TIMEOUT' || d?.code === 'SERVICE_OVERLOADED') {
      const sn = d.service?.name ?? 'Il servizio richiesto';
      const detail = d.code === 'SERVICE_UNAVAILABLE' ? `${sn} non e attivo al momento.` : d.code === 'SERVICE_TIMEOUT' ? `${sn} non ha risposto in tempo.` : `${sn} e temporaneamente sovraccarico.`;
      return Promise.reject(new Error(detail)); }
    return Promise.reject(new Error(d?.errors?.[0] || d?.message || 'Errore di rete')); }
  return Promise.reject(error); });
export const api = {
  contratti: { list: (p?: Record<string,string>) => apiClient.get('/Contratti', { params: p }).then(r => r.data), get: (id: string) => apiClient.get(`/Contratti/${id}`).then(r => r.data), create: (d: any) => apiClient.post('/Contratti', d).then(r => r.data), update: (id: string, d: any) => apiClient.put(`/Contratti/${id}`, d).then(r => r.data), delete: (id: string) => apiClient.delete(`/Contratti/${id}`).then(r => r.data), statistiche: () => apiClient.get('/Contratti/statistiche').then(r => r.data) },
  ip: { list: (p?: Record<string,string>) => apiClient.get('/ProprietaIntellettuale', { params: p }).then(r => r.data), get: (id: string) => apiClient.get(`/ProprietaIntellettuale/${id}`).then(r => r.data), create: (d: any) => apiClient.post('/ProprietaIntellettuale', d).then(r => r.data), statistiche: () => apiClient.get('/ProprietaIntellettuale/statistiche').then(r => r.data) },
  scadenze: { list: (p?: Record<string,string>) => apiClient.get('/Scadenze', { params: p }).then(r => r.data), get: (id: string) => apiClient.get(`/Scadenze/${id}`).then(r => r.data), create: (d: any) => apiClient.post('/Scadenze', d).then(r => r.data), prossime: (g?: number) => apiClient.get('/Scadenze/prossime', { params: { giorni: g } }).then(r => r.data), alert: () => apiClient.get('/Scadenze/alert').then(r => r.data) },
  compliance: { list: (p?: Record<string,string>) => apiClient.get('/Compliance', { params: p }).then(r => r.data), get: (id: string) => apiClient.get(`/Compliance/${id}`).then(r => r.data), create: (d: any) => apiClient.post('/Compliance', d).then(r => r.data), dashboard: () => apiClient.get('/Compliance/dashboard').then(r => r.data) },
  contenzioso: { list: (p?: Record<string,string>) => apiClient.get('/Contenzioso', { params: p }).then(r => r.data), get: (id: string) => apiClient.get(`/Contenzioso/${id}`).then(r => r.data), create: (d: any) => apiClient.post('/Contenzioso', d).then(r => r.data), statistiche: () => apiClient.get('/Contenzioso/statistiche').then(r => r.data) },
  ai: { ask: (d: any) => apiClient.post('/AI/ask', d).then(r => r.data), settings: () => apiClient.get('/AI/settings').then(r => r.data), saveSettings: (d: any) => apiClient.put('/AI/settings', d).then(r => r.data) },
};
export default apiClient;
