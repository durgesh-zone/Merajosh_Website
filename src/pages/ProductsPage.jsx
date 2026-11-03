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
    <div className="container-page py-2.5 sm:py-3">
      <div className="flex gap-2.5 sm:gap-3">
        <aside className="hidden w-[270px] shrink-0 lg:block">
          <div className="card sticky top-[116px] max-h-[calc(100vh-8rem)] overflow-y-auto px-4 pb-2 pt-4"><FilterPanel filters={filters} onChange={update} onClear={clear} /></div>
        </aside>

        <div className="card min-w-0 flex-1 overflow-hidden">
          <div className="border-b border-slate-100 px-4 pt-4 dark:border-slate-800">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h1 className="text-base font-semibold capitalize">{heading}</h1>
              <p className="text-xs text-fk-muted">{isLoading ? 'Loading…' : `(Showing ${total.toLocaleString('en-IN')} product${total === 1 ? '' : 's'})`}</p>
            </div>
            <div className="mt-2 flex items-center justify-between gap-3 lg:hidden">
              <Button variant="outline" size="sm" onClick={() => setDrawer(true)}><SlidersHorizontal className="h-4 w-4" /> Filters</Button>
              <Select aria-label="Sort by" className="w-44" value={filters.sort || ''} onChange={(e) => update({ sort: e.target.value })} options={SORT_OPTIONS} />
            </div>
            <div className="scrollbar-none mt-1 hidden items-center gap-1 overflow-x-auto text-sm lg:flex" role="tablist" aria-label="Sort by">
              <span className="mr-2 font-semibold">Sort By</span>
              {SORT_OPTIONS.map((o) => {
                const active = (filters.sort || '') === o.value;
                return (
                  <button key={o.value} role="tab" aria-selected={active} onClick={() => update({ sort: o.value })} className={`whitespace-nowrap border-b-2 px-3 py-2 transition ${active ? 'border-brand-600 font-semibold text-brand-600' : 'border-transparent text-fk-ink hover:text-brand-600 dark:text-slate-300'}`}>
                    {o.label}
                  </button>
                );
              })}
            </div>
            <div className="pb-3 empty:hidden"><ActiveFilters filters={filters} onChange={update} /></div>
          </div>

          <div className={`transition-opacity ${isFetching && !isLoading ? 'opacity-60' : ''}`}>
            {!isLoading && !data?.data.length ? (
              <EmptyState icon={SearchX} title="Sorry, no results found!" description="Please check the spelling or try searching for something else." action={<Button onClick={clear}>Clear filters</Button>} />
            ) : (
              <ProductGrid products={data?.data || []} loading={isLoading} skeletonCount={12} />
            )}
          </div>
          <Pagination className="border-t border-slate-100 py-4 dark:border-slate-800" page={page} totalPages={data?.meta?.totalPages} onChange={(p) => { update({ page: String(p) }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
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
