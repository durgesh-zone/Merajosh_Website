import { useSyncExternalStore } from 'react';
import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cartApi } from '@/services/cart.api';
import { getErrorMessage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { guestCartStore } from './guestCart';

const EMPTY = { items: [], summary: { itemCount: 0, itemsTotal: 0, mrpTotal: 0, productDiscount: 0, shippingFee: 0 } };

/**
 * One cart API for the whole app. Signed-in users use the server cart; guests use
 * localStorage, priced live through /cart/preview.
 */
export function useCart() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const guestItems = useSyncExternalStore(guestCartStore.subscribe, guestCartStore.getSnapshot);

  const serverCart = useQuery({ queryKey: ['cart'], queryFn: cartApi.get, enabled: isAuthenticated });
  const guestCart = useQuery({
    queryKey: ['cart', 'guest', guestItems],
    queryFn: () => cartApi.preview(guestItems),
    enabled: !isAuthenticated && !authLoading && guestItems.length > 0,
    placeholderData: keepPreviousData,
  });

  const setCart = (data) => queryClient.setQueryData(['cart'], data);
  const onError = (err) => toast.error(getErrorMessage(err));

  const addMutation = useMutation({
    mutationFn: async ({ product, variantId = null, quantity = 1, silent = false }) => {
      if (isAuthenticated) {
        const data = await cartApi.add({ productId: product._id, variantId, quantity });
        setCart(data);
      } else {
        guestCartStore.add({ productId: product._id, variantId, quantity, isVirtual: product.type === 'virtual' });
      }
      return { silent };
    },
    onSuccess: ({ silent }) => !silent && toast.success('Added to cart'),
    onError,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, quantity }) => {
      if (isAuthenticated) setCart(await cartApi.update(id, quantity));
      else guestCartStore.update(id, quantity);
    },
    onError,
  });

  const removeMutation = useMutation({
    mutationFn: async (id) => {
      if (isAuthenticated) setCart(await cartApi.remove(id));
      else guestCartStore.remove(id);
    },
    onError,
  });

  const cart = isAuthenticated ? serverCart.data || EMPTY : guestItems.length ? guestCart.data || EMPTY : EMPTY;
  const isLoading = authLoading || (isAuthenticated ? serverCart.isLoading : guestItems.length > 0 && guestCart.isLoading);

  return {
    cart,
    items: cart.items,
    summary: cart.summary,
    count: isAuthenticated ? cart.summary?.itemCount || 0 : guestItems.reduce((s, i) => s + i.quantity, 0),
    isLoading,
    addItem: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    updateItem: (id, quantity) => updateMutation.mutate({ id, quantity }),
    removeItem: (id) => removeMutation.mutate(id),
    isUpdating: updateMutation.isPending || removeMutation.isPending,
  };
}
