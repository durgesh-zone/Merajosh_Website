import { api, unwrap } from '@/lib/api';

export const accountApi = {
  addresses: () => unwrap(api.get('/account/addresses')),
  createAddress: (body) => unwrap(api.post('/account/addresses', body)),
  updateAddress: (id, body) => unwrap(api.put(`/account/addresses/${id}`, body)),
  deleteAddress: (id) => api.delete(`/account/addresses/${id}`),
  wishlist: () => unwrap(api.get('/account/wishlist')),
  wishlistIds: () => unwrap(api.get('/account/wishlist/ids')),
  addToWishlist: (productId) => api.post(`/account/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/account/wishlist/${productId}`),
  library: () => unwrap(api.get('/account/library')),
};
