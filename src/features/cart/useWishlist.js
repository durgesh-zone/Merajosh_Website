import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { accountApi } from '@/services/account.api';
import { getErrorMessage } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export function useWishlist() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: ids = [] } = useQuery({ queryKey: ['wishlist', 'ids'], queryFn: accountApi.wishlistIds, enabled: isAuthenticated });

  const toggle = useMutation({
    mutationFn: async (productId) => {
      const inList = ids.includes(productId);
      if (inList) await accountApi.removeFromWishlist(productId);
      else await accountApi.addToWishlist(productId);
      return !inList;
    },
    onMutate: async (productId) => {
      const prev = queryClient.getQueryData(['wishlist', 'ids']) || [];
      queryClient.setQueryData(['wishlist', 'ids'], prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);
      return { prev };
    },
    onSuccess: (added) => {
      toast.success(added ? 'Saved to wishlist' : 'Removed from wishlist', { icon: added ? '💜' : undefined });
      queryClient.invalidateQueries({ queryKey: ['wishlist', 'items'] });
    },
    onError: (err, _id, context) => {
      queryClient.setQueryData(['wishlist', 'ids'], context?.prev);
      toast.error(getErrorMessage(err));
    },
  });

  return {
    ids,
    has: (productId) => ids.includes(String(productId)),
    toggle: (productId) => {
      if (!isAuthenticated) {
        toast('Sign in to save items to your wishlist', { icon: '🔒' });
        navigate('/login', { state: { from: location } });
        return;
      }
      toggle.mutate(String(productId));
    },
  };
}
