import { Link } from 'react-router-dom';
import { FileText, Zap } from 'lucide-react';
import { RatingPill, Skeleton } from '@/components/ui';
import { assetUrl, cn } from '@/lib/utils';
import { PriceTag } from './PriceTag';
import { WishlistButton } from './WishlistButton';

/** Grid cell used on listing and wishlist pages (sits inside a hairline grid). */
export function ProductCard({ product, className }) {
  const image = product.images?.[0]?.url;
  const lowStock = !product.isVirtual && product.inStock && product.stock <= 5;
  const freeDelivery = product.isVirtual || product.finalPrice >= 499;
  return (
    <div className={cn('group relative h-full bg-white transition-shadow hover:z-10 hover:shadow-lift dark:bg-slate-900', className)}>
      <Link to={`/product/${product.slug}`} className="flex h-full flex-col p-3 sm:p-4">
        <div className="relative aspect-square w-full overflow-hidden">
          {image && (
            <img src={assetUrl(image)} alt={product.title} loading="lazy" className={cn('h-full w-full object-contain transition duration-300 group-hover:scale-105', !product.inStock && 'opacity-60 grayscale')} />
          )}
          <div className="absolute left-0 top-0 flex flex-col items-start gap-1">
            {product.activeOffer && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-fk-orange px-1.5 py-0.5 text-[10px] font-bold uppercase text-white"><Zap className="h-3 w-3 fill-white" /> Deal</span>
            )}
            {product.isVirtual && (
              <span className="inline-flex items-center gap-1 rounded-sm bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white"><FileText className="h-3 w-3" /> E-book</span>
            )}
          </div>
          {!product.inStock && (
            <span className="absolute inset-x-0 bottom-2 mx-auto w-fit rounded-sm bg-white px-2 py-0.5 text-xs font-semibold text-rose-600 shadow dark:bg-slate-800">Currently unavailable</span>
          )}
        </div>
        <div className="mt-3 flex flex-1 flex-col">
          {product.brand && <p className="truncate text-xs font-medium uppercase text-fk-muted">{product.brand}</p>}
          <h3 className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm leading-5 text-fk-ink group-hover:text-brand-600 dark:text-slate-100">{product.title}</h3>
          <RatingPill className="mt-1.5" value={product.ratingAverage} count={product.ratingCount} />
          <PriceTag className="mt-auto pt-2" price={product.finalPrice} mrp={product.mrp} discountPercent={product.discountPercent} />
          {lowStock ? (
            <p className="mt-1 text-xs font-medium text-rose-600">Only {product.stock} left</p>
          ) : freeDelivery ? (
            <p className="mt-1 text-xs text-fk-ink dark:text-slate-300">{product.isVirtual ? 'Instant download' : 'Free delivery'}</p>
          ) : null}
        </div>
      </Link>
      <WishlistButton productId={product._id} className="absolute right-2 top-2" />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white p-4 dark:bg-slate-900">
      <Skeleton className="aspect-square" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
      </div>
    </div>
  );
}
