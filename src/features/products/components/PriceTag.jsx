import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

export function PriceTag({ price, mrp, discountPercent, size = 'md', className }) {
  const big = size === 'lg';
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span className={cn('font-bold tracking-tight', big ? 'text-3xl' : 'text-base')}>{formatPrice(price)}</span>
      {mrp > price && <span className={cn('text-slate-400 line-through', big ? 'text-lg' : 'text-xs')}>{formatPrice(mrp)}</span>}
      {discountPercent > 0 && <span className={cn('font-bold text-emerald-600', big ? 'text-lg' : 'text-xs')}>{discountPercent}% off</span>}
    </div>
  );
}
