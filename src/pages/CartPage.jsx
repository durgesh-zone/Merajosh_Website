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
        <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Looks like you haven't added anything yet. Explore our latest products and offers." action={<Button as={Link} to="/products" size="lg">Start shopping</Button>} />
      </div>
    );
  }

  const hasIssues = items.some((i) => !i.available);
  const checkout = () => navigate(isAuthenticated ? '/checkout' : '/login', { state: isAuthenticated ? undefined : { from: { pathname: '/checkout' } } });

  return (
    <div className="container-page py-6 pb-28 lg:pb-8">
      <h1 className="text-2xl font-extrabold tracking-tight">Shopping cart <span className="text-base font-medium text-slate-500">({summary.itemCount} item{summary.itemCount === 1 ? '' : 's'})</span></h1>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        <div className="card px-5">
          {hasIssues && (
            <p className="mt-5 flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
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
        <div className="space-y-4 lg:sticky lg:top-32">
          <PriceSummary summary={summary}>
            <Button size="lg" className="mt-5 hidden w-full lg:flex" onClick={checkout} disabled={hasIssues}>Proceed to checkout</Button>
          </PriceSummary>
          <p className="flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck className="h-4 w-4" /> Safe and secure payments. 100% authentic products.</p>
        </div>
      </div>

      {/* Sticky checkout bar on phones */}
      <div className="fixed inset-x-0 bottom-[58px] z-20 flex items-center justify-between gap-4 border-t border-slate-200 bg-white px-4 py-3 lg:hidden dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-lg font-extrabold">₹{(summary.itemsTotal + summary.shippingFee).toLocaleString('en-IN')}</p>
          <p className="text-xs text-slate-500">incl. delivery</p>
        </div>
        <Button size="lg" onClick={checkout} disabled={hasIssues}>Checkout</Button>
      </div>
    </div>
  );
}
