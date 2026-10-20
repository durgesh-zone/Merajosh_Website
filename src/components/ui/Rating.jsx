import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Read-only star rating. */
export function Stars({ value = 0, size = 14, className }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i + 1));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="absolute inset-0 text-slate-300 dark:text-slate-600" style={{ width: size, height: size }} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="fill-amber-400 text-amber-400" style={{ width: size, height: size }} />
            </span>
          </span>
        );
      })}
    </div>
  );
}

/** Compact green rating pill (Flipkart-style). */
export function RatingPill({ value, count, className }) {
  if (!count) return null;
  const tone = value >= 4 ? 'bg-emerald-600' : value >= 3 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs text-slate-500', className)}>
      <span className={cn('inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold text-white', tone)}>
        {value.toFixed(1)} <Star className="h-3 w-3 fill-white" />
      </span>
      ({count.toLocaleString('en-IN')})
    </span>
  );
}

/** Interactive star picker for forms. */
export function StarInput({ value, onChange, size = 32 }) {
  const labels = ['Terrible', 'Bad', 'Okay', 'Good', 'Excellent'];
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i} star${i > 1 ? 's' : ''}`}
            onClick={() => onChange(i)}
            className="transition-transform hover:scale-110"
          >
            <Star style={{ width: size, height: size }} className={cn(i <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600')} />
          </button>
        ))}
      </div>
      {value > 0 && <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{labels[value - 1]}</span>}
    </div>
  );
}
