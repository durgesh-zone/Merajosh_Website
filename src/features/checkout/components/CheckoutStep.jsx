import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Numbered checkout section with a done state and an optional "Change" action. */
export function CheckoutStep({ number, title, done, active, summary, onEdit, children }) {
  return (
    <section className={cn('card overflow-hidden')}>
      <header className={cn('flex items-center gap-3 px-4 py-3.5 sm:px-6', active && 'bg-brand-600 text-white')}>
        <span className={cn('grid h-5 w-5 place-items-center rounded-sm text-xs font-semibold', active ? 'bg-white text-brand-600' : 'bg-slate-100 text-brand-600 dark:bg-slate-800')}>
          {number}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className={cn('flex items-center gap-2 font-medium uppercase', !active && 'text-fk-muted')}>{title}{done && !active && <Check className="h-4 w-4 text-brand-600" strokeWidth={3} />}</h2>
          {!active && summary && <div className="mt-0.5 truncate text-sm font-medium text-fk-ink dark:text-slate-200">{summary}</div>}
        </div>
        {!active && done && onEdit && <button onClick={onEdit} className="rounded-sm border border-slate-300 px-5 py-2 text-sm font-medium uppercase text-brand-600 hover:bg-brand-50 dark:border-slate-700">Change</button>}
      </header>
      {active && <div className="p-4 sm:p-6">{children}</div>}
    </section>
  );
}
