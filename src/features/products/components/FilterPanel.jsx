import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star, X } from 'lucide-react';
import { catalogApi } from '@/services/catalog.api';
import { Button, Checkbox } from '@/components/ui';
import { cn } from '@/lib/utils';

const Section = ({ title, children }) => (
  <div className="border-b border-slate-100 py-5 last:border-0 dark:border-slate-800">
    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">{title}</h3>
    {children}
  </div>
);

/** Sidebar filters. `filters` is the current query object; `onChange(patch)` updates it. */
export function FilterPanel({ filters, onChange, onClear }) {
  const { data: categories = [] } = useQuery({ queryKey: ['categories', 'tree'], queryFn: () => catalogApi.categories(), staleTime: 300_000 });
  const { data: brands = [] } = useQuery({ queryKey: ['brands', filters.category || ''], queryFn: () => catalogApi.brands(filters.category), staleTime: 300_000 });
  const [price, setPrice] = useState({ min: filters.minPrice || '', max: filters.maxPrice || '' });
  useEffect(() => setPrice({ min: filters.minPrice || '', max: filters.maxPrice || '' }), [filters.minPrice, filters.maxPrice]);

  const selectedBrands = filters.brand ? filters.brand.split(',') : [];
  const toggleBrand = (b) => {
    const next = selectedBrands.includes(b) ? selectedBrands.filter((x) => x !== b) : [...selectedBrands, b];
    onChange({ brand: next.join(',') });
  };

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <h2 className="text-lg font-bold">Filters</h2>
        <button onClick={onClear} className="text-sm font-semibold text-brand-600 hover:underline">Clear all</button>
      </div>

      <Section title="Category">
        <ul className="space-y-1">
          <li>
            <button onClick={() => onChange({ category: '' })} className={cn('w-full rounded-lg px-2.5 py-1.5 text-left text-sm', !filters.category ? 'bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800')}>All categories</button>
          </li>
          {categories.map((c) => (
            <li key={c._id}>
              <button onClick={() => onChange({ category: c.slug })} className={cn('w-full rounded-lg px-2.5 py-1.5 text-left text-sm', filters.category === c.slug ? 'bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800')}>{c.name}</button>
              {c.children?.length > 0 && (filters.category === c.slug || c.children.some((s) => s.slug === filters.category)) && (
                <ul className="ml-3 mt-1 space-y-1 border-l border-slate-200 pl-2 dark:border-slate-700">
                  {c.children.map((s) => (
                    <li key={s._id}>
                      <button onClick={() => onChange({ category: s.slug })} className={cn('w-full rounded-lg px-2.5 py-1 text-left text-sm', filters.category === s.slug ? 'font-semibold text-brand-600' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400')}>{s.name}</button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Price">
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            onChange({ minPrice: price.min, maxPrice: price.max });
          }}
        >
          <input className="field py-2" inputMode="numeric" placeholder="Min ₹" value={price.min} onChange={(e) => setPrice((p) => ({ ...p, min: e.target.value.replace(/\D/g, '') }))} aria-label="Minimum price" />
          <span className="text-slate-400">–</span>
          <input className="field py-2" inputMode="numeric" placeholder="Max ₹" value={price.max} onChange={(e) => setPrice((p) => ({ ...p, max: e.target.value.replace(/\D/g, '') }))} aria-label="Maximum price" />
          <Button type="submit" size="sm" variant="secondary">Go</Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[[0, 499], [500, 999], [1000, 1999], [2000, '']].map(([min, max]) => (
            <button key={min} onClick={() => onChange({ minPrice: String(min || ''), maxPrice: String(max) })} className="rounded-full border border-slate-200 px-2.5 py-1 text-xs hover:border-brand-400 dark:border-slate-700">
              {max ? `₹${min}–₹${max}` : `₹${min}+`}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Customer rating">
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <label key={r} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input type="radio" name="rating" className="accent-brand-600" checked={Number(filters.rating) === r} onChange={() => onChange({ rating: String(r) })} />
              <span className="inline-flex items-center gap-1">{r}<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> & above</span>
            </label>
          ))}
          {filters.rating && <button className="text-xs text-slate-500 hover:underline" onClick={() => onChange({ rating: '' })}>Any rating</button>}
        </div>
      </Section>

      <Section title="Product type">
        <div className="flex gap-2">
          {[['', 'All'], ['physical', 'Physical'], ['virtual', 'E-books']].map(([v, l]) => (
            <button key={v} onClick={() => onChange({ type: v })} className={cn('rounded-full border px-3 py-1.5 text-xs font-semibold transition', (filters.type || '') === v ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700')}>{l}</button>
          ))}
        </div>
      </Section>

      <Section title="Availability">
        <Checkbox label="In stock only" checked={filters.inStock === 'true'} onChange={(e) => onChange({ inStock: e.target.checked ? 'true' : '' })} />
      </Section>

      {brands.length > 0 && (
        <Section title="Brand">
          <div className="max-h-48 space-y-2 overflow-y-auto">
            {brands.map((b) => <Checkbox key={b} label={b} checked={selectedBrands.includes(b)} onChange={() => toggleBrand(b)} />)}
          </div>
        </Section>
      )}
    </div>
  );
}

/** Removable chips summarising active filters. */
export function ActiveFilters({ filters, onChange }) {
  const chips = [];
  if (filters.q) chips.push(['q', `“${filters.q}”`]);
  if (filters.category) chips.push(['category', filters.category.replace(/-/g, ' ')]);
  if (filters.type) chips.push(['type', filters.type === 'virtual' ? 'E-books' : 'Physical']);
  if (filters.minPrice || filters.maxPrice) chips.push(['price', `₹${filters.minPrice || 0} – ${filters.maxPrice ? `₹${filters.maxPrice}` : 'any'}`]);
  if (filters.rating) chips.push(['rating', `${filters.rating}★ & above`]);
  if (filters.inStock) chips.push(['inStock', 'In stock']);
  if (filters.brand) chips.push(['brand', filters.brand.split(',').join(', ')]);
  if (!chips.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key === 'price' ? { minPrice: '', maxPrice: '' } : { [key]: '' })}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold capitalize text-brand-700 hover:bg-brand-100 dark:bg-brand-500/10 dark:text-brand-300"
        >
          {label} <X className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
}
