import { api, unwrap } from '@/lib/api';

export const cartApi = {
  get: () => unwrap(api.get('/cart')),
  preview: (items) => unwrap(api.post('/cart/preview', { items })),
  add: (body) => unwrap(api.post('/cart/items', body)),
  update: (itemId, quantity) => unwrap(api.patch(`/cart/items/${itemId}`, { quantity })),
  remove: (itemId) => unwrap(api.delete(`/cart/items/${itemId}`)),
  clear: () => unwrap(api.delete('/cart')),
  merge: (items) => unwrap(api.post('/cart/merge', { items })),
};
