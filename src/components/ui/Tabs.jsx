import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Pill tabs with an animated active indicator. */
export function Tabs({ tabs, value, onChange, className, layoutId = 'tabs' }) {
  return (
    <div role="tablist" className={cn('inline-flex gap-1 border-b border-slate-200 dark:border-slate-800', className)}>
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(t.value)}
            className={cn('relative px-4 py-2.5 text-sm font-semibold transition-colors', active ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300')}
          >
            {active && <motion.span layoutId={layoutId} className="absolute inset-x-0 -bottom-px h-0.5 bg-brand-600" transition={{ type: 'spring', damping: 30, stiffness: 400 }} />}
            <span className="relative flex items-center gap-2">
              {t.label}
              {t.count != null && <span className="rounded-full bg-slate-200 px-1.5 text-[11px] dark:bg-slate-600">{t.count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
