import { api, unwrap, unwrapWithMeta } from '@/lib/api';

export const catalogApi = {
  home: () => unwrap(api.get('/home')),
  categories: (params) => unwrap(api.get('/categories', { params })),
  products: (params) => unwrapWithMeta(api.get('/products', { params })),
  suggest: (q) => unwrap(api.get('/products/suggest', { params: { q } })),
  brands: (category) => unwrap(api.get('/products/brands', { params: { category } })),
  product: (slug) => unwrap(api.get(`/products/${slug}`)),
  reviews: (productId, params) => unwrapWithMeta(api.get(`/products/${productId}/reviews`, { params })),
  reviewEligibility: (productId) => unwrap(api.get(`/reviews/eligibility/${productId}`)),
  createReview: (productId, formData) => unwrap(api.post(`/products/${productId}/reviews`, formData)),
  updateReview: (id, formData) => unwrap(api.patch(`/reviews/${id}`, formData)),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  availableCoupons: () => unwrap(api.get('/coupons/available')),
};
