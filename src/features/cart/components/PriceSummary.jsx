import { Truck } from 'lucide-react';
import { formatPrice } from '@/lib/format';

/** Order price breakdown used by both cart and checkout. */
export function PriceSummary({ summary, coupon, children }) {
  if (!summary) return null;
  const rows = [
    { label: `Price (${summary.itemCount} item${summary.itemCount === 1 ? '' : 's'})`, value: formatPrice(summary.mrpTotal) },
    summary.productDiscount > 0 && { label: 'Discount', value: `− ${formatPrice(summary.productDiscount)}`, green: true },
    summary.couponDiscount > 0 && { label: `Coupon${coupon?.code ? ` (${coupon.code})` : ''}`, value: `− ${formatPrice(summary.couponDiscount)}`, green: true },
    summary.hasPhysical !== false && { label: 'Delivery', value: summary.shippingFee ? formatPrice(summary.shippingFee) : 'FREE', green: !summary.shippingFee },
    summary.tax > 0 && { label: 'Tax', value: formatPrice(summary.tax) },
  ].filter(Boolean);
  const total = summary.total ?? summary.itemsTotal + summary.shippingFee;
  const savings = (summary.productDiscount || 0) + (summary.couponDiscount || 0);
  const remaining = summary.freeShippingThreshold - summary.itemsTotal;

  return (
    <div className="card p-5">
      <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Price details</h2>
      <dl className="mt-4 space-y-3 text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between">
            <dt className="text-slate-600 dark:text-slate-400">{r.label}</dt>
            <dd className={r.green ? 'font-medium text-emerald-600' : 'font-medium'}>{r.value}</dd>
          </div>
        ))}
        <div className="flex justify-between border-t border-dashed border-slate-200 pt-3 text-base font-bold dark:border-slate-700">
          <dt>Total amount</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {savings > 0 && (
        <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          You save {formatPrice(savings)} on this order 🎉
        </p>
      )}
      {summary.hasPhysical && summary.shippingFee > 0 && remaining > 0 && (
        <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Truck className="h-4 w-4 text-brand-500" /> Add {formatPrice(remaining)} more for free delivery
        </p>
      )}
      {children}
    </div>
  );
}
