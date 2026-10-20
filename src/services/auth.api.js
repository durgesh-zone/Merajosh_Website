import { api, unwrap } from '@/lib/api';

export const authApi = {
  me: () => unwrap(api.get('/auth/me')).then((d) => d.user),
  login: (body) => unwrap(api.post('/auth/login', body)).then((d) => d.user),
  register: (body) => unwrap(api.post('/auth/register', body)).then((d) => d.user),
  logout: () => api.post('/auth/logout'),
  refresh: () => unwrap(api.post('/auth/refresh')).then((d) => d.user),
  updateProfile: (body) => unwrap(api.patch('/auth/me', body)).then((d) => d.user),
  changePassword: (body) => api.post('/auth/change-password', body),
};
