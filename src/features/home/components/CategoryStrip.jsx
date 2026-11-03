import { Link } from 'react-router-dom';
import { LayoutGrid, BookOpen } from 'lucide-react';
import { Skeleton } from '@/components/ui';
import { assetUrl } from '@/lib/utils';

const Tile = ({ to, label, children }) => (
  <Link to={to} className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5 text-center sm:w-24">
    <div className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-brand-50 transition group-hover:scale-105 sm:h-16 sm:w-16 dark:bg-brand-500/10">{children}</div>
    <span className="line-clamp-1 text-xs font-semibold text-fk-ink group-hover:text-brand-600 sm:text-sm dark:text-slate-200">{label}</span>
  </Link>
);

/** White panel of round category shortcuts under the header. */
export function CategoryStrip({ categories = [], loading }) {
  return (
    <section className="card px-2 py-3 sm:px-4 sm:py-4" aria-label="Shop by category">
      <div className="scrollbar-none flex gap-2 overflow-x-auto sm:justify-around sm:gap-4">
        {loading ? (
          Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex w-[72px] shrink-0 flex-col items-center gap-2 sm:w-24">
              <Skeleton className="h-14 w-14 rounded-full sm:h-16 sm:w-16" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))
        ) : (
          <>
            <Tile to="/products" label="All"><LayoutGrid className="h-6 w-6 text-brand-600" /></Tile>
            {categories.map((c) => (
              <Tile key={c._id} to={`/products?category=${c.slug}`} label={c.name}>
                {c.image?.url ? <img src={assetUrl(c.image.url)} alt="" loading="lazy" className="h-full w-full object-cover" /> : <span className="text-lg font-bold text-brand-600">{c.name[0]}</span>}
              </Tile>
            ))}
            <Tile to="/products?type=virtual" label="E-books"><BookOpen className="h-6 w-6 text-brand-600" /></Tile>
          </>
        )}
      </div>
    </section>
  );
}
