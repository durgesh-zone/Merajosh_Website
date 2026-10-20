import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { SlidersHorizontal, SearchX, X } from 'lucide-react';
import { catalogApi } from '@/services/catalog.api';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { FilterPanel, ActiveFilters } from '@/features/products/components/FilterPanel';
import { Button, EmptyState, Pagination, Select } from '@/components/ui';
import { SORT_OPTIONS } from '@/lib/constants';
import { paramsToObject } from '@/lib/utils';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function ProductsPage() {
  const [params, setParams] = useSearchParams();
  const filters = paramsToObject(params);
  const page = Number(filters.page) || 1;
  const [drawer, setDrawer] = useState(false);
  useDocumentTitle(filters.q ? `Results for “${filters.q}”` : 'Shop');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => catalogApi.products({ ...filters, limit: 12 }),
    placeholderData: keepPreviousData,
  });

  const update = (patch) => {
    const next = { ...filters, ...patch };
    if (!('page' in patch)) delete next.page;
    setParams(Object.fromEntries(Object.entries(next).filter(([, v]) => v !== '' && v != null)));
  };
  const clear = () => setParams(filters.q ? { q: filters.q } : {});

  const total = data?.meta?.total ?? 0;
  const heading = filters.q ? `Results for “${filters.q}”` : filters.type === 'virtual' ? 'E-books' : filters.category ? filters.category.replace(/-/g, ' ') : 'All products';

  return (
    <div className="container-page py-6">
      <div className="flex gap-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="card sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto p-5"><FilterPanel filters={filters} onChange={update} onClear={clear} /></div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold capitalize tracking-tight">{heading}</h1>
              <p className="mt-1 text-sm text-slate-500">{isLoading ? 'Loading…' : `${total.toLocaleString('en-IN')} product${total === 1 ? '' : 's'}`}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setDrawer(true)}><SlidersHorizontal className="h-4 w-4" /> Filters</Button>
              <Select aria-label="Sort by" className="w-48" value={filters.sort || ''} onChange={(e) => update({ sort: e.target.value })} options={SORT_OPTIONS} />
            </div>
          </div>
          <ActiveFilters filters={filters} onChange={update} />

          <div className={`mt-5 transition-opacity ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
            {!isLoading && !data?.data.length ? (
              <EmptyState icon={SearchX} title="No products found" description="Try removing some filters or searching for something else." action={<Button onClick={clear}>Clear filters</Button>} />
            ) : (
              <ProductGrid products={data?.data || []} loading={isLoading} skeletonCount={12} />
            )}
          </div>
          <Pagination className="mt-10" page={page} totalPages={data?.meta?.totalPages} onChange={(p) => { update({ page: String(p) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>
      </div>

      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div className="absolute inset-0 bg-slate-950/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawer(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 30, stiffness: 300 }} className="absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto bg-white p-5 dark:bg-slate-900">
              <button onClick={() => setDrawer(false)} className="absolute right-4 top-4 rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Close filters"><X className="h-5 w-5" /></button>
              <FilterPanel filters={filters} onChange={update} onClear={clear} />
              <Button className="mt-4 w-full" onClick={() => setDrawer(false)}>Show {total} results</Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
