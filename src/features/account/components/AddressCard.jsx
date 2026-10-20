import { MapPin, Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/utils';

export function AddressCard({ address, selected, onSelect, onEdit, onDelete }) {
  const selectable = Boolean(onSelect);
  return (
    <div
      role={selectable ? 'radio' : undefined}
      aria-checked={selectable ? selected : undefined}
      tabIndex={selectable ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={(e) => selectable && (e.key === 'Enter' || e.key === ' ') && onSelect()}
      className={cn(
        'rounded-2xl border-2 p-4 transition',
        selectable && 'cursor-pointer',
        selected ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-500/10' : 'border-slate-200 hover:border-slate-300 dark:border-slate-800',
      )}
    >
      <div className="flex items-start gap-3">
        {selectable ? (
          <span className={cn('mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2', selected ? 'border-brand-600' : 'border-slate-300')}>
            {selected && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
          </span>
        ) : (
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold">{address.fullName}</span>
            <Badge tone="slate" className="uppercase">{address.type}</Badge>
            {address.isDefault && <Badge tone="brand">Default</Badge>}
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {[address.line1, address.line2, address.landmark].filter(Boolean).join(', ')}, {address.city}, {address.state} – <b>{address.pincode}</b>
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Phone: {address.phone}</p>
        </div>
        <div className="flex shrink-0 gap-1">
          {onEdit && <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label="Edit address"><Pencil className="h-4 w-4" /></button>}
          {onDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" aria-label="Delete address"><Trash2 className="h-4 w-4" /></button>}
        </div>
      </div>
    </div>
  );
}
