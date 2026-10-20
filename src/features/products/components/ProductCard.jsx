import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Zap } from 'lucide-react';
import { RatingPill, Skeleton } from '@/components/ui';
import { assetUrl, cn } from '@/lib/utils';
import { PriceTag } from './PriceTag';
import { WishlistButton } from './WishlistButton';

export function ProductCard({ product, className }) {
  const image = product.images?.[0]?.url;
  const lowStock = !product.isVirtual && product.inStock && product.stock <= 5;
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300, damping: 22 }} className={cn('group relative h-full', className)}>
      <Link to={`/product/${product.slug}`} className="card flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lift">
        <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
          {image && (
            <img src={assetUrl(image)} alt={product.title} loading="lazy" className={cn('h-full w-full object-cover transition duration-500 group-hover:scale-105', !product.inStock && 'opacity-60 grayscale')} />
          )}
          <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
            {product.activeOffer && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-bold text-white shadow"><Zap className="h-3 w-3 fill-white" /> Sale</span>
            )}
            {product.isVirtual && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-brand-700 shadow-sm dark:bg-slate-900/90 dark:text-brand-300"><FileText className="h-3 w-3" /> E-book</span>
            )}
          </div>
          {!product.inStock && (
            <span className="absolute inset-x-0 bottom-0 bg-slate-900/75 py-1.5 text-center text-xs font-semibold text-white">Out of stock</span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-3.5">
          {product.brand && <p className="truncate text-xs font-medium text-slate-500">{product.brand}</p>}
          <h3 className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-5">{product.title}</h3>
          <RatingPill className="mt-2" value={product.ratingAverage} count={product.ratingCount} />
          <PriceTag className="mt-auto pt-2" price={product.finalPrice} mrp={product.mrp} discountPercent={product.discountPercent} />
          {lowStock && <p className="mt-1 text-xs font-semibold text-amber-600">Only {product.stock} left</p>}
        </div>
      </Link>
      <WishlistButton productId={product._id} className="absolute right-2.5 top-2.5" />
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-square rounded-none" />
      <div className="space-y-2 p-3.5">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}
