import { Zap } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';
import { ProductCard } from '@/features/products/components/ProductCard';

const Unit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="grid h-10 w-11 place-items-center rounded-lg bg-white/15 text-lg font-extrabold tabular-nums backdrop-blur sm:h-12 sm:w-14 sm:text-2xl">{String(value).padStart(2, '0')}</span>
    <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider opacity-80">{label}</span>
  </div>
);

export function FlashSale({ sale }) {
  const { days, hours, minutes, seconds, done } = useCountdown(sale?.endsAt);
  if (!sale || done || !sale.products?.length) return null;

  return (
    <section className="my-6 overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-fuchsia-600 to-brand-600 p-4 text-white shadow-lift sm:p-7">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20"><Zap className="h-5 w-5 fill-amber-300 text-amber-300" /></span>
            <h2 className="text-2xl font-extrabold tracking-tight">{sale.title}</h2>
          </div>
          {sale.description && <p className="mt-1 text-sm opacity-90">{sale.description}</p>}
        </div>
        <div className="flex items-center gap-2" aria-live="off" aria-label="Sale ends in">
          <span className="mr-1 text-xs font-semibold uppercase opacity-80">Ends in</span>
          {days > 0 && <Unit value={days} label="days" />}
          <Unit value={hours} label="hrs" />
          <Unit value={minutes} label="min" />
          <Unit value={seconds} label="sec" />
        </div>
      </div>
      <div className="scrollbar-none -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 text-slate-900 sm:gap-4 dark:text-slate-100">
        {sale.products.map((p) => (
          <div key={p._id} className="w-[46%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-[19%]">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
