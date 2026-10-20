import { cn } from '@/lib/utils';

/** Shimmering placeholder block used while data loads. */
export function Skeleton({ className }) {
  return (
    <div className={cn('relative overflow-hidden rounded-xl bg-slate-200/70 dark:bg-slate-800', className)} aria-hidden>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/5" />
    </div>
  );
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn('h-3.5', i === lines - 1 ? 'w-2/3' : 'w-full')} />
      ))}
    </div>
  );
}
