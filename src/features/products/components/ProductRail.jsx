import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ProductCard, ProductCardSkeleton } from './ProductCard';

/** Horizontally scrolling row of product cards with arrow controls. */
export function ProductRail({ title, subtitle, products = [], loading, viewAllTo, badge }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: 'smooth' });
  if (!loading && !products.length) return null;

  return (
    <section className="py-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
            {badge}
          </div>
          {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          {viewAllTo && (
            <Link to={viewAllTo} className="mr-1 hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2 sm:flex dark:text-brand-400">
              View all <ArrowRight className="h-4 w-4 transition-all" />
            </Link>
          )}
          <button onClick={() => scroll(-1)} className="hidden h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 md:grid dark:border-slate-700 dark:bg-slate-900" aria-label="Scroll left"><ChevronLeft className="h-4 w-4" /></button>
          <button onClick={() => scroll(1)} className="hidden h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white hover:bg-slate-50 md:grid dark:border-slate-700 dark:bg-slate-900" aria-label="Scroll right"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div ref={ref} className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 pt-1 sm:gap-5">
        {(loading ? Array.from({ length: 5 }) : products).map((p, i) => (
          <div key={p?._id || i} className="w-[46%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-[19%]">
            {loading ? <ProductCardSkeleton /> : <ProductCard product={p} />}
          </div>
        ))}
      </div>
      {viewAllTo && (
        <Link to={viewAllTo} className="mt-1 flex items-center justify-center gap-1 text-sm font-semibold text-brand-600 sm:hidden">View all <ArrowRight className="h-4 w-4" /></Link>
      )}
    </section>
  );
}
