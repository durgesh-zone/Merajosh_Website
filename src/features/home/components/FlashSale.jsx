import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { RailPanel } from '@/features/products/components/ProductRail';

const pad = (n) => String(n).padStart(2, '0');

/** "Deals of the day" panel with a live countdown. */
export function FlashSale({ sale }) {
  const { days, hours, minutes, seconds, done } = useCountdown(sale?.endsAt);
  if (!sale || done || !sale.products?.length) return null;

  const header = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <h2 className="section-title">{sale.title}</h2>
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-fk-muted" aria-label="Sale ends in">
        <Clock className="h-4 w-4" />
        {days > 0 && `${days}d `}{pad(hours)} : {pad(minutes)} : {pad(seconds)} Left
      </span>
    </div>
  );

  return (
    <RailPanel
      header={header}
      subtitle={sale.description}
      products={sale.products}
      action={<Link to="/products?sort=popularity" className="rounded-sm bg-brand-600 px-5 py-2 text-xs font-semibold uppercase text-white shadow-sm hover:bg-brand-700">View all</Link>}
    />
  );
}
