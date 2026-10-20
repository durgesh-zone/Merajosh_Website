import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui';
import { assetUrl } from '@/lib/utils';

export function CategoryStrip({ categories = [], loading }) {
  return (
    <section className="py-6" aria-label="Shop by category">
      <div className="scrollbar-none -mx-4 flex gap-4 overflow-x-auto px-4 sm:justify-center sm:gap-8">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex shrink-0 flex-col items-center gap-2">
              <Skeleton className="h-16 w-16 rounded-full sm:h-20 sm:w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))
          : categories.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/products?category=${c.slug}`} className="group flex w-20 shrink-0 flex-col items-center gap-2 text-center sm:w-24">
                <div className="h-16 w-16 overflow-hidden rounded-full bg-gradient-to-br from-brand-100 to-violet-100 ring-4 ring-white shadow-soft transition group-hover:scale-105 group-hover:shadow-lift sm:h-20 sm:w-20 dark:from-brand-500/20 dark:to-violet-500/20 dark:ring-slate-900">
                  {c.image?.url && <img src={assetUrl(c.image.url)} alt="" className="h-full w-full object-cover" />}
                </div>
                <span className="text-xs font-semibold text-slate-700 group-hover:text-brand-600 sm:text-sm dark:text-slate-300">{c.name}</span>
              </Link>
            </motion.div>
          ))}
      </div>
    </section>
  );
}
