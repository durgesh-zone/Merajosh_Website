import { motion } from 'framer-motion';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

export function ProductGrid({ products, loading, skeletonCount = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => <ProductCardSkeleton key={i} />)
        : products.map((p, i) => (
          <motion.div key={p._id} className="h-full" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i, 8) * 0.04 }}>
            <ProductCard product={p} />
          </motion.div>
        ))}
    </div>
  );
}
