import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/format';

/** Chips for picking a variant (size / shade / colour). Out-of-stock options are disabled. */
export function VariantSelector({ variants, value, onChange }) {
  if (!variants?.length) return null;
  const label = variants[0].label;
  const selected = variants.find((v) => v._id === value);
  return (
    <div>
      <p className="mb-2.5 text-sm font-semibold">
        {label}: <span className="font-normal text-slate-500">{selected ? selected.value : `Select a ${label.toLowerCase()}`}</span>
      </p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {variants.map((v) => {
          const out = v.stock <= 0;
          const active = v._id === value;
          return (
            <button
              key={v._id}
              role="radio"
              aria-checked={active}
              disabled={out}
              onClick={() => onChange(v._id)}
              className={cn(
                'relative rounded-xl border-2 px-4 py-2 text-sm font-semibold transition',
                active ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700',
                out && 'cursor-not-allowed border-dashed text-slate-400 line-through opacity-60',
              )}
            >
              {v.value}
              {v.priceDelta !== 0 && !out && <span className="ml-1.5 text-xs font-normal text-slate-500">{formatPrice(v.finalPrice)}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
