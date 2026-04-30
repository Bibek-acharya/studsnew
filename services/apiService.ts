import { apiRequest } from './api';

const apiService = {
  post: (path: string, data: any) => apiRequest(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path: string, data: any) => apiRequest(path, { method: 'PUT', body: JSON.stringify(data) }),
  get: (path: string) => apiRequest(path),
  delete: (path: string) => apiRequest(path, { method: 'DELETE' }),
};

export default apiService;
