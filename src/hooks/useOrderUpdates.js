import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getSocket } from '@/lib/socket';
import { useAuth } from '@/context/AuthContext';
import { STATUS_META } from '@/lib/constants';

/** Listens for realtime order changes and refreshes the affected queries. */
export function useOrderUpdates() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) return undefined;
    const socket = getSocket();
    const onUpdate = (payload) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', payload.orderId] });
      const label = STATUS_META[payload.status]?.label;
      if (label && payload.status !== 'pending_payment') {
        toast(`Order ${payload.orderNumber}: ${label}`, { icon: payload.status === 'out_for_delivery' ? '🛵' : '📦', id: `${payload.orderId}-${payload.status}` });
      }
    };
    socket.on('order:updated', onUpdate);
    return () => socket.off('order:updated', onUpdate);
  }, [isAuthenticated, queryClient]);
}
