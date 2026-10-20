import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Download, XCircle, RotateCcw, CreditCard, MapPin, Wallet, Star, BookOpen, Loader2 } from 'lucide-react';
import { orderApi, downloadFile } from '@/services/order.api';
import { getErrorMessage } from '@/lib/api';
import { formatDate, formatDateTime, formatPrice } from '@/lib/format';
import { assetUrl } from '@/lib/utils';
import { Button, ConfirmDialog, PageLoader, Textarea, EmptyState } from '@/components/ui';
import { OrderTimeline } from '@/features/orders/components/OrderTimeline';
import { DeliveryOtpCard } from '@/features/orders/components/DeliveryOtpCard';
import { OrderStatusBadge, PaymentStatusBadge } from '@/features/orders/components/OrderStatusBadge';
import { PriceSummary } from '@/features/cart/components/PriceSummary';
import { usePaymentFlow } from '@/features/checkout/usePaymentFlow';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const CANCELLABLE = ['pending_payment', 'placed', 'confirmed', 'packed'];
const RETURN_DAYS = 7;

export default function OrderDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: order, isLoading, error } = useQuery({ queryKey: ['order', id], queryFn: () => orderApi.get(id), refetchInterval: (q) => (q.state.data?.status === 'out_for_delivery' ? 30_000 : false) });
  const [dialog, setDialog] = useState(null);
  const [reason, setReason] = useState('');
  const [downloading, setDownloading] = useState(false);
  const { pay, paymentDialog } = usePaymentFlow();
  useDocumentTitle(order ? `Order ${order.orderNumber}` : 'Order');

  const refresh = (data) => {
    if (data) queryClient.setQueryData(['order', id], data);
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  };

  const cancel = useMutation({
    mutationFn: () => orderApi.cancel(id, reason || undefined),
    onSuccess: (data) => { toast.success('Order cancelled'); refresh(data); setDialog(null); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
  const requestReturn = useMutation({
    mutationFn: () => orderApi.requestReturn(id, reason),
    onSuccess: (data) => { toast.success('Return requested'); refresh(data); setDialog(null); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });
  const retry = useMutation({
    mutationFn: async () => {
      const { order: o, payment } = await orderApi.retryPayment(id);
      return pay({ order: o, payment });
    },
    onSuccess: (data) => { toast.success('Payment successful'); refresh(data); },
    onError: (err) => { toast.error(err.message || getErrorMessage(err)); refresh(); },
  });

  if (isLoading) return <PageLoader />;
  if (error || !order) return <EmptyState title="Order not found" description={getErrorMessage(error)} action={<Button as={Link} to="/account/orders">Back to orders</Button>} />;

  const canCancel = CANCELLABLE.includes(order.status);
  const deliveredAt = order.deliveredAt ? new Date(order.deliveredAt) : null;
  const canReturn = order.status === 'delivered' && order.hasPhysical && deliveredAt && Date.now() - deliveredAt.getTime() < RETURN_DAYS * 864e5;
  const canPay = order.status === 'pending_payment' && order.payment.method === 'razorpay';
  const a = order.shippingAddress;
  const summary = { ...order.pricing, itemCount: order.items.reduce((s, i) => s + i.quantity, 0), hasPhysical: order.hasPhysical };
  const reviewable = order.status === 'delivered' || (order.payment.status === 'paid' && !order.hasPhysical);

  const invoice = async () => {
    setDownloading(true);
    try {
      await downloadFile(`/orders/${id}/invoice`, `invoice-${order.orderNumber}.pdf`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-5">
      <Link to="/account/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-brand-600"><ArrowLeft className="h-4 w-4" /> All orders</Link>

      <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-extrabold">Order {order.orderNumber}</h1><OrderStatusBadge status={order.status} /></div>
          <p className="mt-1 text-sm text-slate-500">Placed on {formatDateTime(order.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canPay && <Button variant="accent" onClick={() => retry.mutate()} loading={retry.isPending}><CreditCard className="h-4 w-4" /> Complete payment</Button>}
          {order.status !== 'pending_payment' && <Button variant="outline" onClick={invoice} disabled={downloading}>{downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Invoice</Button>}
          {canReturn && <Button variant="outline" onClick={() => { setReason(''); setDialog('return'); }}><RotateCcw className="h-4 w-4" /> Return</Button>}
          {canCancel && <Button variant="ghost" className="text-rose-600" onClick={() => { setReason(''); setDialog('cancel'); }}><XCircle className="h-4 w-4" /> Cancel</Button>}
        </div>
      </div>

      {order.payment.status === 'failed' && canPay && (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">Your last payment attempt failed{order.payment.failureReason ? ` (${order.payment.failureReason})` : ''}. No money was taken — please try again.</p>
      )}
      <DeliveryOtpCard otp={order.deliveryOtp} deliveryBoy={order.deliveryBoy} />

      <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <div className="card p-5 sm:p-6">
            <h2 className="mb-5 font-bold">Order status</h2>
            <OrderTimeline order={order} />
          </div>

          <div className="card p-5">
            <h2 className="mb-2 font-bold">Items</h2>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {order.items.map((i) => (
                <li key={i._id} className="flex items-center gap-4 py-4">
                  <Link to={`/product/${i.slug}`}><img src={assetUrl(i.image)} alt="" className="h-16 w-16 rounded-xl object-cover" /></Link>
                  <div className="min-w-0 flex-1">
                    <Link to={`/product/${i.slug}`} className="line-clamp-1 font-semibold hover:text-brand-600">{i.title}</Link>
                    <p className="text-xs text-slate-500">{i.variant?.value && `${i.variant.label}: ${i.variant.value} · `}Qty {i.quantity} · {formatPrice(i.price)} each</p>
                    <div className="mt-1.5 flex flex-wrap gap-3">
                      {reviewable && !i.reviewed && <Link to={`/product/${i.slug}#reviews`} className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600"><Star className="h-3.5 w-3.5" /> Rate & review</Link>}
                      {i.type === 'virtual' && order.payment.status === 'paid' && <Link to="/account/library" className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"><BookOpen className="h-3.5 w-3.5" /> Download</Link>}
                    </div>
                  </div>
                  <p className="font-bold">{formatPrice(i.lineTotal)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-5">
          {a?.line1 && (
            <div className="card p-5">
              <h2 className="mb-3 flex items-center gap-2 font-bold"><MapPin className="h-4 w-4 text-brand-500" /> Delivery address</h2>
              <p className="font-semibold">{a.fullName}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{[a.line1, a.line2, a.landmark].filter(Boolean).join(', ')}, {a.city}, {a.state} – {a.pincode}</p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Phone: {a.phone}</p>
            </div>
          )}
          <div className="card space-y-2 p-5 text-sm">
            <h2 className="mb-3 flex items-center gap-2 font-bold"><Wallet className="h-4 w-4 text-brand-500" /> Payment</h2>
            <div className="flex justify-between"><span className="text-slate-500">Method</span><span className="font-medium">{order.payment.method === 'cod' ? 'Cash on Delivery' : 'Online (Razorpay)'}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Status</span><PaymentStatusBadge status={order.payment.status} /></div>
            {order.payment.paidAt && <div className="flex justify-between"><span className="text-slate-500">Paid on</span><span>{formatDate(order.payment.paidAt)}</span></div>}
            {order.refund?.status && order.refund.status !== 'none' && (
              <div className="mt-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <p className="font-semibold">Refund {order.refund.status === 'processed' ? 'processed' : order.refund.status === 'failed' ? 'delayed' : 'in progress'}</p>
                <p className="text-xs text-slate-500">{formatPrice(order.refund.amount)}{order.refund.status === 'processed' ? ` on ${formatDate(order.refund.processedAt)}` : ' · usually 5–7 business days'}</p>
              </div>
            )}
          </div>
          <PriceSummary summary={summary} coupon={order.coupon} />
        </div>
      </div>

      <ConfirmDialog open={dialog === 'cancel'} onClose={() => setDialog(null)} onConfirm={() => cancel.mutate()} loading={cancel.isPending} title="Cancel this order?" description={order.payment.status === 'paid' ? 'Your payment will be refunded to the original payment method.' : 'This cannot be undone.'} confirmText="Cancel order">
        <Textarea className="mt-4" rows={2} label="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} />
      </ConfirmDialog>
      <ConfirmDialog open={dialog === 'return'} onClose={() => setDialog(null)} onConfirm={() => (reason.trim().length >= 3 ? requestReturn.mutate() : toast.error('Please tell us why you are returning this order'))} loading={requestReturn.isPending} title="Request a return" tone="primary" confirmText="Request return">
        <Textarea rows={3} label="Why are you returning this?" value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} placeholder="E.g. damaged item, wrong shade…" />
      </ConfirmDialog>
      {paymentDialog}
    </div>
  );
}
