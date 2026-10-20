import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, AlertCircle, FileText } from 'lucide-react';
import { QuantityStepper, Badge } from '@/components/ui';
import { formatPrice } from '@/lib/format';
import { assetUrl } from '@/lib/utils';

export function CartItemRow({ item, onQuantity, onRemove, disabled }) {
  const p = item.product;
  return (
    <motion.li layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }} className="flex gap-4 py-5">
      <Link to={p ? `/product/${p.slug}` : '#'} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-28 dark:bg-slate-800">
        {p?.image && <img src={assetUrl(p.image)} alt={p.title} className="h-full w-full object-cover" loading="lazy" />}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {p ? (
              <Link to={`/product/${p.slug}`} className="line-clamp-2 font-semibold hover:text-brand-600">{p.title}</Link>
            ) : (
              <span className="font-semibold text-slate-400">Unavailable product</span>
            )}
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              {p?.brand && <span>{p.brand}</span>}
              {item.variant && <span>{item.variant.label}: <b className="text-slate-700 dark:text-slate-300">{item.variant.value}</b></span>}
              {p?.type === 'virtual' && <Badge tone="brand"><FileText className="h-3 w-3" /> E-book</Badge>}
            </div>
          </div>
          <button onClick={onRemove} disabled={disabled} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" aria-label={`Remove ${p?.title || 'item'}`}>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          {p?.type === 'virtual' || !item.available ? (
            <span className="text-xs text-slate-500">{p?.type === 'virtual' ? 'Qty 1 · Instant download' : ''}</span>
          ) : (
            <QuantityStepper size="sm" value={item.quantity} max={Math.min(10, item.stock || 10)} onChange={onQuantity} disabled={disabled} />
          )}
          {item.available !== false && item.price != null && (
            <div className="text-right">
              <div className="font-bold">{formatPrice(item.lineTotal)}</div>
              {item.lineMrp > item.lineTotal && <div className="text-xs text-slate-400 line-through">{formatPrice(item.lineMrp)}</div>}
            </div>
          )}
        </div>
        {item.issue && (
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600"><AlertCircle className="h-3.5 w-3.5" /> {item.issue}</p>
        )}
      </div>
    </motion.li>
  );
}
