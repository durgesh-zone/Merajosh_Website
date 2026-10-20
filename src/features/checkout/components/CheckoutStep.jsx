import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Numbered checkout section with a done state and an optional "Change" action. */
export function CheckoutStep({ number, title, done, active, summary, onEdit, children }) {
  return (
    <section className={cn('card overflow-hidden', active && 'ring-2 ring-brand-500/30')}>
      <header className={cn('flex items-center gap-3 px-5 py-4', active && 'bg-brand-600 text-white')}>
        <span className={cn('grid h-7 w-7 place-items-center rounded-lg text-sm font-bold', active ? 'bg-white/20' : done ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800')}>
          {done && !active ? <Check className="h-4 w-4" /> : number}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-bold uppercase tracking-wide">{title}</h2>
          {!active && summary && <div className="mt-0.5 truncate text-sm text-slate-500">{summary}</div>}
        </div>
        {!active && done && onEdit && <button onClick={onEdit} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 dark:border-slate-700">Change</button>}
      </header>
      {active && <div className="p-5">{children}</div>}
    </section>
  );
}
