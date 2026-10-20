import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const range = (page, total) => {
  const pages = new Set([1, total, page, page - 1, page + 1]);
  const list = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  list.forEach((p, i) => {
    if (i && p - list[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
};

export function Pagination({ page, totalPages, onChange, className }) {
  if (!totalPages || totalPages <= 1) return null;
  const btn = 'grid h-10 min-w-10 place-items-center rounded-xl px-3 text-sm font-semibold transition';
  return (
    <nav className={cn('flex items-center justify-center gap-1.5', className)} aria-label="Pagination">
      <button className={cn(btn, 'hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800')} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" />
      </button>
      {range(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-1 text-slate-400">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(btn, p === page ? 'bg-brand-600 text-white shadow-sm' : 'hover:bg-slate-100 dark:hover:bg-slate-800')}
          >
            {p}
          </button>
        ),
      )}
      <button className={cn(btn, 'hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800')} disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
