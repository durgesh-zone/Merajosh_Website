import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ShoppingCart, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useCart } from '@/features/cart/useCart';
import { CartItemRow } from '@/features/cart/components/CartItemRow';
import { PriceSummary } from '@/features/cart/components/PriceSummary';
import { useAuth } from '@/context/AuthContext';
import { Button, EmptyState, Skeleton } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function CartPage() {
  useDocumentTitle('Cart');
  const { items, summary, isLoading, updateItem, removeItem, isUpdating } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_380px]">
        <div className="card space-y-6 p-5">{[1, 2, 3].map((i) => <div key={i} className="flex gap-4"><Skeleton className="h-24 w-24" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-1/3" /></div></div>)}</div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container-page py-12">
        <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Looks like you haven't added anything yet. Explore our latest products and offers." action={<Button as={Link} to="/products" size="lg" className="px-16">Shop now</Button>} />
      </div>
    );
  }

  const hasIssues = items.some((i) => !i.available);
  const checkout = () => navigate(isAuthenticated ? '/checkout' : '/login', { state: isAuthenticated ? undefined : { from: { pathname: '/checkout' } } });

  return (
    <div className="container-page py-3 pb-28 lg:pb-3">
      <div className="grid items-start gap-3 lg:grid-cols-[1fr_380px]">
        <div className="card">
          <h1 className="border-b border-slate-100 px-4 py-4 text-lg font-semibold sm:px-6 dark:border-slate-800">My Cart <span className="text-sm font-normal text-fk-muted">({summary.itemCount} item{summary.itemCount === 1 ? '' : 's'})</span></h1>
          <div className="px-4 sm:px-6">
          {hasIssues && (
            <p className="mt-4 flex items-center gap-2 rounded-sm bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
              <AlertTriangle className="h-4 w-4" /> Some items need your attention before checkout.
            </p>
          )}
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartItemRow key={item._id} item={item} disabled={isUpdating} onQuantity={(q) => updateItem(item._id, q)} onRemove={() => removeItem(item._id)} />
              ))}
            </AnimatePresence>
          </ul>
          </div>
          <div className="sticky bottom-0 hidden justify-end border-t border-slate-100 bg-white px-6 py-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] lg:flex dark:border-slate-800 dark:bg-slate-900">
            <Button size="lg" variant="buy" className="h-12 w-60 uppercase" onClick={checkout} disabled={hasIssues}>Place order</Button>
          </div>
        </div>
        <div className="space-y-4 lg:sticky lg:top-[120px]">
          <PriceSummary summary={summary} />
          <p className="flex items-center gap-2 px-2 text-sm font-semibold text-fk-muted"><ShieldCheck className="h-6 w-6 shrink-0" /> Safe and secure payments. Easy returns. 100% authentic products.</p>
        </div>
      </div>

      {/* Sticky checkout bar on phones */}
      <div className="fixed inset-x-0 bottom-[58px] z-20 flex items-center justify-between gap-4 bg-white px-4 py-2.5 shadow-[0_-2px_6px_rgba(0,0,0,0.08)] lg:hidden dark:bg-slate-900">
        <div>
          <p className="text-lg font-extrabold">₹{(summary.itemsTotal + summary.shippingFee).toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500">incl. delivery</p>
        </div>
        <Button size="lg" variant="buy" className="uppercase" onClick={checkout} disabled={hasIssues}>Place order</Button>
      </div>
    </div>
  );
}
