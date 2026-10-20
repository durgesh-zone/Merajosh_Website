import { motion } from 'framer-motion';
import { Check, X, RotateCcw, AlertTriangle, CreditCard } from 'lucide-react';
import { ORDER_STEPS, STATUS_META } from '@/lib/constants';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Live status timeline: Placed → Confirmed → Packed → Shipped → Out for delivery → Delivered,
 * with off-path events (cancelled, failed attempt, return) shown where they happened.
 */
export function OrderTimeline({ order }) {
  const history = order.statusHistory || [];
  const lastAt = (status) => [...history].reverse().find((h) => h.status === status);
  const offPath = ['cancelled', 'return_requested', 'returned', 'delivery_failed'];

  if (order.status === 'pending_payment') {
    return (
      <div className="flex items-start gap-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-500/10">
        <CreditCard className="mt-0.5 h-5 w-5 text-amber-600" />
        <div>
          <p className="font-semibold text-amber-800 dark:text-amber-300">Waiting for payment</p>
          <p className="text-sm text-amber-700/90 dark:text-amber-300/80">Complete the payment to confirm this order. Unpaid orders are cancelled automatically after 30 minutes.</p>
        </div>
      </div>
    );
  }

  // Digital-only orders skip shipping steps.
  const steps = order.hasPhysical ? ORDER_STEPS : ORDER_STEPS.filter((s) => ['placed', 'delivered'].includes(s.key));
  const reachedIndex = steps.reduce((max, s, i) => (lastAt(s.key) ? i : max), -1);
  const isCancelled = order.status === 'cancelled';

  const extra = history.filter((h) => offPath.includes(h.status));

  return (
    <div>
      <ol className="relative">
        {steps.map((step, i) => {
          const event = lastAt(step.key);
          const done = i <= reachedIndex && !(isCancelled && !event);
          const current = i === reachedIndex && !isCancelled && order.status !== 'delivered';
          const isLast = i === steps.length - 1;
          return (
            <li key={step.key} className="relative flex gap-4 pb-7 last:pb-0">
              {!isLast && (
                <span className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 bg-slate-200 dark:bg-slate-700">
                  <motion.span className="block w-full bg-emerald-500" initial={{ height: 0 }} animate={{ height: i < reachedIndex ? '100%' : 0 }} transition={{ duration: 0.5, delay: i * 0.12 }} />
                </span>
              )}
              <motion.span
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  'relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2',
                  done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-300 bg-white text-slate-300 dark:border-slate-600 dark:bg-slate-900',
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                {current && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />}
              </motion.span>
              <div className="pt-1">
                <p className={cn('font-semibold', !done && 'text-slate-400')}>{step.label}</p>
                {event && <p className="text-xs text-slate-500">{formatDateTime(event.at)}{event.note ? ` · ${event.note}` : ''}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      {extra.length > 0 && (
        <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
          {extra.map((h, i) => {
            const Icon = h.status === 'cancelled' ? X : h.status === 'delivery_failed' ? AlertTriangle : RotateCcw;
            const tone = h.status === 'cancelled' ? 'text-rose-600 bg-rose-50 dark:bg-rose-500/10' : 'text-amber-700 bg-amber-50 dark:bg-amber-500/10';
            return (
              <li key={i} className="flex items-start gap-3">
                <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-full', tone)}><Icon className="h-4 w-4" /></span>
                <div className="pt-1">
                  <p className="font-semibold">{STATUS_META[h.status]?.label}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(h.at)}{h.note ? ` · ${h.note}` : ''}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
