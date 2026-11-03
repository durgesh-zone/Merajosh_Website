import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui';
import { formatPrice } from '@/lib/format';
import { assetUrl, cn } from '@/lib/utils';

/** Compact deal tile: image, name, green offer line, brand. */
export function DealTile({ product }) {
  const image = product.images?.[0]?.url;
  return (
    <Link to={`/product/${product.slug}`} className="group flex h-full flex-col items-center px-3 py-4 text-center">
      <div className="h-32 w-full shrink-0 overflow-hidden sm:h-40">
        {image && <img src={assetUrl(image)} alt={product.title} loading="lazy" className={cn('h-full w-full object-contain transition duration-300 group-hover:scale-105', !product.inStock && 'opacity-60 grayscale')} />}
      </div>
      <p className="mt-3 line-clamp-1 w-full text-sm font-medium text-fk-ink group-hover:text-brand-600 dark:text-slate-100">{product.title}</p>
      <p className="mt-1 text-sm font-semibold text-fk-green">
        {product.discountPercent > 0 ? `Min. ${product.discountPercent}% Off` : `Just ${formatPrice(product.finalPrice)}`}
      </p>
      <p className="mt-0.5 line-clamp-1 w-full text-xs text-fk-muted">{product.inStock === false ? 'Out of stock' : product.brand || formatPrice(product.finalPrice)}</p>
    </Link>
  );
}

function DealTileSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 px-3 py-4">
      <Skeleton className="h-32 w-28 sm:h-40" />
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3.5 w-1/2" />
    </div>
  );
}

/** White panel with a header row and a horizontally scrolling strip of deal tiles. */
export function RailPanel({ header, subtitle, action, products = [], loading }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4 dark:border-slate-800">
        <div className="min-w-0">
          {header}
          {subtitle && <p className="mt-0.5 truncate text-xs text-fk-muted sm:text-sm">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="group/rail relative">
        <div ref={ref} className="scrollbar-none flex snap-x overflow-x-auto">
          {(loading ? Array.from({ length: 6 }) : products).map((p, i) => (
            <div key={p?._id || i} className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[22%] lg:w-[16.666%]">
              {loading ? <DealTileSkeleton /> : <DealTile product={p} />}
            </div>
          ))}
        </div>
        {!loading && products.length > 4 && (
          <>
            <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 hidden h-24 w-10 -translate-y-1/2 place-items-center rounded-r-sm bg-white text-fk-ink shadow-md md:grid dark:bg-slate-800 dark:text-slate-100" aria-label="Scroll left"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 hidden h-24 w-10 -translate-y-1/2 place-items-center rounded-l-sm bg-white text-fk-ink shadow-md md:grid dark:bg-slate-800 dark:text-slate-100" aria-label="Scroll right"><ChevronRight className="h-5 w-5" /></button>
          </>
        )}
      </div>
    </section>
  );
}

/** Titled product rail used on the home and product pages. */
export function ProductRail({ title, subtitle, products = [], loading, viewAllTo, badge }) {
  if (!loading && !products.length) return null;
  return (
    <RailPanel
      header={<div className="flex items-center gap-3"><h2 className="section-title">{title}</h2>{badge}</div>}
      subtitle={subtitle}
      products={products}
      loading={loading}
      action={viewAllTo && (
        <Link to={viewAllTo} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-white shadow-sm hover:bg-brand-700 sm:h-auto sm:w-auto sm:rounded-sm sm:px-5 sm:py-2 sm:text-xs sm:font-semibold sm:uppercase" aria-label={`View all ${title}`}>
          <span className="hidden sm:inline">View all</span>
          <ChevronRight className="h-4 w-4 sm:hidden" />
        </Link>
      )}
    />
  );
}
