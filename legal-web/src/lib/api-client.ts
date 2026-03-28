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
  contratti: { list: (p?: Record<string,string>) => apiClient.get('/contratti/Contratti', { params: p }).then(r => r.data), get: (id: string) => apiClient.get(`/contratti/Contratti/${id}`).then(r => r.data), create: (d: any) => apiClient.post('/contratti/Contratti', d).then(r => r.data), update: (id: string, d: any) => apiClient.put(`/contratti/Contratti/${id}`, d).then(r => r.data), delete: (id: string) => apiClient.delete(`/contratti/Contratti/${id}`).then(r => r.data), statistiche: () => apiClient.get('/contratti/Contratti/statistiche').then(r => r.data) },
  ip: { list: (p?: Record<string,string>) => apiClient.get('/ip/ProprietaIntellettuale', { params: p }).then(r => r.data), get: (id: string) => apiClient.get(`/ip/ProprietaIntellettuale/${id}`).then(r => r.data), create: (d: any) => apiClient.post('/ip/ProprietaIntellettuale', d).then(r => r.data), statistiche: () => apiClient.get('/ip/ProprietaIntellettuale/statistiche').then(r => r.data) },
  scadenze: { list: (p?: Record<string,string>) => apiClient.get('/scadenze/Scadenze', { params: p }).then(r => r.data), get: (id: string) => apiClient.get(`/scadenze/Scadenze/${id}`).then(r => r.data), create: (d: any) => apiClient.post('/scadenze/Scadenze', d).then(r => r.data), prossime: (g?: number) => apiClient.get('/scadenze/Scadenze/prossime', { params: { giorni: g } }).then(r => r.data), alert: () => apiClient.get('/scadenze/Scadenze/alert').then(r => r.data) },
  compliance: { list: (p?: Record<string,string>) => apiClient.get('/compliance/Compliance', { params: p }).then(r => r.data), get: (id: string) => apiClient.get(`/compliance/Compliance/${id}`).then(r => r.data), create: (d: any) => apiClient.post('/compliance/Compliance', d).then(r => r.data), dashboard: () => apiClient.get('/compliance/Compliance/dashboard').then(r => r.data) },
  contenzioso: { list: (p?: Record<string,string>) => apiClient.get('/contenzioso/Contenzioso', { params: p }).then(r => r.data), get: (id: string) => apiClient.get(`/contenzioso/Contenzioso/${id}`).then(r => r.data), create: (d: any) => apiClient.post('/contenzioso/Contenzioso', d).then(r => r.data), statistiche: () => apiClient.get('/contenzioso/Contenzioso/statistiche').then(r => r.data) },
  ai: { ask: (d: any) => apiClient.post('/ai/AI/ask', d).then(r => r.data), settings: () => apiClient.get('/ai/AI/settings').then(r => r.data), saveSettings: (d: any) => apiClient.put('/ai/AI/settings', d).then(r => r.data) },
};
export default apiClient;
