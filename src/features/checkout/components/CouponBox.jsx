import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tag, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui';
import { catalogApi } from '@/services/catalog.api';
import { formatPrice, formatDate } from '@/lib/format';

/** Coupon entry with a list of available offers. Validation happens on the server quote. */
export function CouponBox({ applied, error, onApply, onRemove, loading }) {
  const [code, setCode] = useState('');
  const [showList, setShowList] = useState(false);
  const { data: coupons = [] } = useQuery({ queryKey: ['coupons', 'available'], queryFn: catalogApi.availableCoupons, staleTime: 300_000 });

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 px-4 py-3 dark:border-emerald-500/40 dark:bg-emerald-500/10">
        <div className="flex items-center gap-3">
          <Tag className="h-5 w-5 text-emerald-600" />
          <div>
            <p className="font-bold text-emerald-700 dark:text-emerald-300">{applied.code} applied</p>
            <p className="text-xs text-emerald-700/80 dark:text-emerald-300/80">You save {formatPrice(applied.discount)}</p>
          </div>
        </div>
        <button onClick={onRemove} className="rounded-lg p-2 text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-500/20" aria-label="Remove coupon"><X className="h-4 w-4" /></button>
      </div>
    );
  }

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (code.trim()) onApply(code.trim().toUpperCase());
        }}
      >
        <div className="relative flex-1">
          <Tag className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" aria-label="Coupon code" aria-invalid={Boolean(error)} className={`field pl-10 uppercase ${error ? 'field-error' : ''}`} />
        </div>
        <Button type="submit" variant="secondary" loading={loading} disabled={!code.trim()}>Apply</Button>
      </form>
      {error && <p role="alert" className="mt-2 text-sm font-medium text-rose-600">{error}</p>}
      {coupons.length > 0 && (
        <>
          <button onClick={() => setShowList((s) => !s)} className="mt-3 flex items-center gap-1 text-sm font-semibold text-brand-600">
            {showList ? 'Hide' : 'View'} available coupons <ChevronDown className={`h-4 w-4 transition ${showList ? 'rotate-180' : ''}`} />
          </button>
          {showList && (
            <ul className="mt-3 space-y-2">
              {coupons.map((c) => (
                <li key={c.code} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-bold">{c.code}</p>
                    <p className="text-xs text-slate-500">{c.description}{c.minOrderAmount ? ` · Min ${formatPrice(c.minOrderAmount)}` : ''} · till {formatDate(c.expiresAt)}</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => { setCode(c.code); onApply(c.code); }}>Apply</Button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
