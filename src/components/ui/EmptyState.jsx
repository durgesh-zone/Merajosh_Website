import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}
    >
      {Icon && (
        <div className="mb-5 grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-br from-brand-50 to-violet-100 text-brand-600 dark:from-brand-500/10 dark:to-violet-500/10 dark:text-brand-300">
          <Icon className="h-9 w-9" strokeWidth={1.6} />
        </div>
      )}
      <h3 className="text-lg font-bold">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
