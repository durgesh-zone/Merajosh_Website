import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus, Wallet, CreditCard, Lock, AlertTriangle, ShoppingCart, FileText } from 'lucide-react';
import { orderApi } from '@/services/order.api';
import { accountApi } from '@/services/account.api';
import { getErrorMessage } from '@/lib/api';
import { formatPrice } from '@/lib/format';
import { assetUrl, cn } from '@/lib/utils';
import { Button, EmptyState, PageLoader, Skeleton, Textarea } from '@/components/ui';
import { CheckoutStep } from '@/features/checkout/components/CheckoutStep';
import { CouponBox } from '@/features/checkout/components/CouponBox';
import { PriceSummary } from '@/features/cart/components/PriceSummary';
import { AddressCard } from '@/features/account/components/AddressCard';
import { AddressFormModal } from '@/features/account/components/AddressForm';
import { usePaymentFlow } from '@/features/checkout/usePaymentFlow';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function CheckoutPage() {
  useDocumentTitle('Checkout');
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const buyNow = location.state?.buyNow || null;

  const [couponCode, setCouponCode] = useState('');
  const [addressId, setAddressId] = useState(null);
  const [step, setStep] = useState('address');
  const [method, setMethod] = useState(null);
  const [notes, setNotes] = useState('');
  const [placing, setPlacing] = useState(false);
  const [addrModal, setAddrModal] = useState({ open: false, address: null });

  const { pay, paymentDialog } = usePaymentFlow();

  const quoteBody = useMemo(() => ({ items: buyNow || undefined, couponCode: couponCode || undefined }), [buyNow, couponCode]);
  const { data: quote, isFetching, error } = useQuery({
    queryKey: ['quote', quoteBody],
    queryFn: () => orderApi.quote(quoteBody),
    placeholderData: keepPreviousData,
  });
  const { data: addresses = [], isLoading: addrLoading } = useQuery({ queryKey: ['addresses'], queryFn: accountApi.addresses });

  const summary = quote?.summary;
  const needsAddress = summary?.hasPhysical;
  const options = quote?.paymentOptions;
  const onlineAvailable = options?.razorpayEnabled || options?.mockEnabled;

  useEffect(() => {
    if (!addressId && addresses.length) setAddressId((addresses.find((a) => a.isDefault) || addresses[0])._id);
  }, [addresses, addressId]);
  useEffect(() => {
    if (summary && !needsAddress && step === 'address') setStep('summary');
  }, [summary, needsAddress, step]);
  useEffect(() => {
    if (!options) return;
    if (!method || (method === 'cod' && !options.codAvailable)) setMethod(onlineAvailable ? 'razorpay' : options.codAvailable ? 'cod' : null);
  }, [options, method, onlineAvailable]);
  useEffect(() => {
    if (quote?.couponError && couponCode) toast.error(quote.couponError, { id: 'coupon' });
  }, [quote?.couponError, couponCode]);

  if (!quote && !error) return <PageLoader />;
  if (error || !quote) {
    return <div className="container-page py-12"><EmptyState icon={ShoppingCart} title="Nothing to check out" description={getErrorMessage(error)} action={<Button as={Link} to="/products">Continue shopping</Button>} /></div>;
  }

  const selectedAddress = addresses.find((a) => a._id === addressId);
  const hasProblems = quote.problems.length > 0;

  const placeOrder = async () => {
    if (needsAddress && !addressId) return toast.error('Please select a delivery address');
    if (!method) return toast.error('Choose a payment method');
    setPlacing(true);
    try {
      const { order, payment } = await orderApi.place({
        items: buyNow || undefined,
        addressId: needsAddress ? addressId : undefined,
        paymentMethod: method,
        couponCode: quote.coupon?.code,
        notes: notes || undefined,
      });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      if (!payment) {
        navigate(`/order-success/${order._id}`, { replace: true });
        return;
      }
      try {
        await pay({ order, payment });
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        navigate(`/order-success/${order._id}`, { replace: true });
      } catch (err) {
        toast.error(err.message || getErrorMessage(err));
        navigate(`/account/orders/${order._id}`, { replace: true });
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
      queryClient.invalidateQueries({ queryKey: ['quote'] });
    } finally {
      setPlacing(false);
    }
  };

  let n = 0;
  return (
    <div className="container-page py-6">
      <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"><Lock className="h-5 w-5 text-emerald-600" /> Secure checkout</h1>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {needsAddress && (
            <CheckoutStep
              number={++n}
              title="Delivery address"
              active={step === 'address'}
              done={Boolean(selectedAddress)}
              onEdit={() => setStep('address')}
              summary={selectedAddress && <span><b className="text-slate-700 dark:text-slate-300">{selectedAddress.fullName}</b>, {selectedAddress.line1}, {selectedAddress.city} – {selectedAddress.pincode}</span>}
            >
              {addrLoading ? <Skeleton className="h-24" /> : (
                <div className="space-y-3" role="radiogroup" aria-label="Delivery address">
                  {addresses.map((a) => (
                    <AddressCard key={a._id} address={a} selected={a._id === addressId} onSelect={() => setAddressId(a._id)} onEdit={() => setAddrModal({ open: true, address: a })} />
                  ))}
                  <button onClick={() => setAddrModal({ open: true, address: null })} className="flex w-full items-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 p-4 text-sm font-semibold text-brand-600 hover:border-brand-400 hover:bg-brand-50/50 dark:border-slate-700 dark:hover:bg-brand-500/5">
                    <Plus className="h-4 w-4" /> Add a new address
                  </button>
                  <Button className="mt-2" onClick={() => setStep('summary')} disabled={!addressId}>Deliver here</Button>
                </div>
              )}
            </CheckoutStep>
          )}

          <CheckoutStep number={++n} title="Order summary" active={step === 'summary'} done={step === 'payment'} onEdit={() => setStep('summary')} summary={`${summary.itemCount} item${summary.itemCount === 1 ? '' : 's'} · ${formatPrice(summary.total)}`}>
            {hasProblems && (
              <div className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" /> Some items need attention</p>
                <ul className="mt-1 list-disc pl-6">{quote.problems.map((p) => <li key={p._id}>{p.product?.title || 'Item'}: {p.issue}</li>)}</ul>
                <Link to="/cart" className="mt-2 inline-block font-semibold underline">Update cart</Link>
              </div>
            )}
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {quote.items.filter((i) => i.available).map((i) => (
                <li key={i._id} className="flex items-center gap-4 py-3">
                  <img src={assetUrl(i.product.image)} alt="" className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 font-semibold">{i.product.title}</p>
                    <p className="text-xs text-slate-500">
                      {i.variant && `${i.variant.label}: ${i.variant.value} · `}Qty {i.quantity}
                      {i.product.type === 'virtual' && <span className="ml-1 inline-flex items-center gap-1 text-brand-600"><FileText className="h-3 w-3" /> Instant download</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatPrice(i.lineTotal)}</p>
                    {i.lineMrp > i.lineTotal && <p className="text-xs text-slate-400 line-through">{formatPrice(i.lineMrp)}</p>}
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              <CouponBox applied={quote.coupon} error={couponCode && quote.couponError} loading={isFetching && Boolean(couponCode)} onApply={setCouponCode} onRemove={() => setCouponCode('')} />
            </div>
            {needsAddress && <Textarea className="mt-4" rows={2} label="Delivery instructions (optional)" maxLength={300} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="E.g. call before arriving" />}
            <Button className="mt-5" onClick={() => setStep('payment')} disabled={hasProblems}>Continue to payment</Button>
          </CheckoutStep>

          <CheckoutStep number={++n} title="Payment" active={step === 'payment'}>
            <div className="space-y-3" role="radiogroup" aria-label="Payment method">
              {[
                { value: 'razorpay', icon: CreditCard, title: 'Pay online', text: options.mockEnabled ? 'UPI, cards, net banking (test mode)' : 'UPI, cards, wallets & net banking via Razorpay', enabled: onlineAvailable },
                { value: 'cod', icon: Wallet, title: 'Cash on Delivery', text: summary.isVirtualOnly ? 'Not available for e-books' : 'Pay in cash when your order arrives', enabled: options.codAvailable },
              ].map((o) => (
                <button
                  key={o.value}
                  role="radio"
                  aria-checked={method === o.value}
                  disabled={!o.enabled}
                  onClick={() => setMethod(o.value)}
                  className={cn('flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition disabled:cursor-not-allowed disabled:opacity-50', method === o.value ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700')}
                >
                  <span className={cn('grid h-11 w-11 place-items-center rounded-xl', method === o.value ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500 dark:bg-slate-800')}><o.icon className="h-5 w-5" /></span>
                  <span className="flex-1"><span className="block font-semibold">{o.title}</span><span className="text-sm text-slate-500">{o.text}</span></span>
                </button>
              ))}
            </div>
            <Button size="lg" variant="accent" className="mt-5 w-full sm:w-auto" onClick={placeOrder} loading={placing} disabled={hasProblems || !method}>
              {method === 'cod' ? `Place order · ${formatPrice(summary.total)}` : `Pay ${formatPrice(summary.total)}`}
            </Button>
          </CheckoutStep>
        </div>

        <div className="lg:sticky lg:top-32"><PriceSummary summary={summary} coupon={quote.coupon} /></div>
      </div>

      <AddressFormModal open={addrModal.open} address={addrModal.address} onClose={() => setAddrModal({ open: false, address: null })} onSaved={(a) => setAddressId(a._id)} />
      {paymentDialog}
    </div>
  );
}
