import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

export function PriceTag({ price, mrp, discountPercent, size = 'md', className }) {
  const big = size === 'lg';
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2 gap-y-0.5', className)}>
      <span className={cn('font-semibold tracking-tight text-fk-ink dark:text-slate-100', big ? 'text-[28px]' : 'text-base')}>{formatPrice(price)}</span>
      {mrp > price && <span className={cn('text-fk-muted line-through', big ? 'text-base' : 'text-sm')}>{formatPrice(mrp)}</span>}
      {discountPercent > 0 && <span className={cn('font-semibold text-fk-green', big ? 'text-base' : 'text-[13px]')}>{discountPercent}% off</span>}
    </div>
  );
}
