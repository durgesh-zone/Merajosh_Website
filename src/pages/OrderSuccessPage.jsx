import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, BookOpen } from 'lucide-react';
import { orderApi } from '@/services/order.api';
import { Button, PageLoader } from '@/components/ui';
import { formatPrice } from '@/lib/format';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function OrderSuccessPage() {
  useDocumentTitle('Order placed');
  const { id } = useParams();
  const { data: order, isLoading } = useQuery({ queryKey: ['order', id], queryFn: () => orderApi.get(id) });
  if (isLoading) return <PageLoader />;
  if (!order) return null;
  const paid = order.payment.status === 'paid';

  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-12">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card w-full max-w-lg p-8 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15, stiffness: 200 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-500/15">
          <CheckCircle2 className="h-11 w-11 text-emerald-600" />
        </motion.div>
        <h1 className="mt-6 text-2xl font-extrabold">{order.status === 'pending_payment' ? 'Order created' : 'Order placed successfully!'}</h1>
        <p className="mt-2 text-slate-500">Order <b className="text-slate-800 dark:text-slate-200">{order.orderNumber}</b> · {formatPrice(order.pricing.total)} {paid ? 'paid' : order.payment.method === 'cod' ? 'to pay on delivery' : ''}</p>
        {order.hasVirtual && paid && <p className="mt-4 rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">Your e-books are ready to download in My Library.</p>}
        {order.hasPhysical && <p className="mt-4 text-sm text-slate-500">We'll keep you posted here and on your order page as it moves. You'll see a delivery OTP once it's out for delivery.</p>}
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Button as={Link} to={`/account/orders/${order._id}`} variant="primary"><Package className="h-4 w-4" /> Track order</Button>
          {order.hasVirtual && paid ? (
            <Button as={Link} to="/account/library" variant="secondary"><BookOpen className="h-4 w-4" /> My Library</Button>
          ) : (
            <Button as={Link} to="/products" variant="outline">Continue shopping</Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
