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
    <div className="card">
      <h2 className="border-b border-slate-200 px-6 py-3.5 text-base font-semibold uppercase text-fk-muted dark:border-slate-800">Price details</h2>
      <div className="px-6 pb-5">
      <dl className="mt-5 space-y-4 text-[15px]">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between">
            <dt>{r.label}</dt>
            <dd className={r.green ? 'text-fk-green' : ''}>{r.value}</dd>
          </div>
        ))}
        <div className="flex justify-between border-y border-dashed border-slate-300 py-4 text-lg font-semibold dark:border-slate-700">
          <dt>Total amount</dt>
          <dd>{formatPrice(total)}</dd>
        </div>
      </dl>
      {savings > 0 && (
        <p className="mt-4 text-[15px] font-semibold text-fk-green">
          You will save {formatPrice(savings)} on this order
        </p>
      )}
      {summary.hasPhysical && summary.shippingFee > 0 && remaining > 0 && (
        <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
          <Truck className="h-4 w-4 text-brand-600" /> Add {formatPrice(remaining)} more for free delivery
        </p>
      )}
      {children}
      </div>
    </div>
  );
}
