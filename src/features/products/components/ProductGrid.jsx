import { motion } from 'framer-motion';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

/** Hairline-divided product grid (cells share 1px borders like a marketplace listing). */
export function ProductGrid({ products, loading, skeletonCount = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden bg-slate-200 md:grid-cols-3 xl:grid-cols-4 dark:bg-slate-800">
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => <ProductCardSkeleton key={i} />)
        : products.map((p, i) => (
          <motion.div key={p._id} className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i, 8) * 0.03 }}>
            <ProductCard product={p} />
          </motion.div>
        ))}
    </div>
  );
}
