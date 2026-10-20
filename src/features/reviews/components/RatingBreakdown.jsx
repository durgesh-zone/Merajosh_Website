import { Star } from 'lucide-react';
import { Stars } from '@/components/ui';

export function RatingBreakdown({ average, count, distribution = [] }) {
  const max = Math.max(1, ...distribution.map((d) => d.count));
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="text-center sm:w-40">
        <div className="flex items-center justify-center gap-1 text-5xl font-extrabold">{average?.toFixed(1) || '0.0'}<Star className="h-7 w-7 fill-amber-400 text-amber-400" /></div>
        <Stars value={average} className="mt-2 justify-center" />
        <p className="mt-1 text-sm text-slate-500">{count.toLocaleString('en-IN')} rating{count === 1 ? '' : 's'}</p>
      </div>
      <div className="flex-1 space-y-2">
        {distribution.map(({ star, count: c }) => (
          <div key={star} className="flex items-center gap-3 text-sm">
            <span className="w-6 font-medium">{star}★</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className={`h-full rounded-full ${star >= 4 ? 'bg-emerald-500' : star === 3 ? 'bg-amber-400' : 'bg-rose-500'}`} style={{ width: `${(c / max) * 100}%` }} />
            </div>
            <span className="w-8 text-right text-slate-500">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
