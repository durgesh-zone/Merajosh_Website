import { api, unwrap, unwrapWithMeta } from '@/lib/api';

export const orderApi = {
  quote: (body) => unwrap(api.post('/orders/quote', body)),
  place: (body) => unwrap(api.post('/orders', body)),
  list: (params) => unwrapWithMeta(api.get('/orders', { params })),
  get: (id) => unwrap(api.get(`/orders/${id}`)),
  retryPayment: (id) => unwrap(api.post(`/orders/${id}/pay`)),
  cancel: (id, reason) => unwrap(api.post(`/orders/${id}/cancel`, { reason })),
  requestReturn: (id, reason) => unwrap(api.post(`/orders/${id}/return`, { reason })),
  paymentConfig: () => unwrap(api.get('/payments/config')),
  verifyPayment: (body) => unwrap(api.post('/payments/verify', body)),
  reportFailure: (orderId, reason) => api.post('/payments/failed', { orderId, reason }),
  completeMock: (orderId, outcome) => unwrap(api.post('/payments/mock/complete', { orderId, outcome })),
};

/** Downloads a protected file (cookies included) and saves it with the given name. */
export async function downloadFile(url, fileName) {
  const res = await api.get(url, { responseType: 'blob' });
  const href = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = href;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(href), 1000);
}
