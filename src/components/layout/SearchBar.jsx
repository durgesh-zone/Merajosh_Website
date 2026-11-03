import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Tag, Loader2 } from 'lucide-react';
import { catalogApi } from '@/services/catalog.api';
import { useDebounce } from '@/hooks/useDebounce';
import { formatPrice } from '@/lib/format';
import { assetUrl, cn } from '@/lib/utils';

/** Header search with live suggestions and keyboard navigation. */
export function SearchBar({ className, autoFocus }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounce(q.trim(), 220);
  const boxRef = useRef(null);

  const { data, isFetching } = useQuery({
    queryKey: ['suggest', debounced],
    queryFn: () => catalogApi.suggest(debounced),
    enabled: debounced.length >= 2,
    staleTime: 60_000,
  });

  useEffect(() => {
    const onClick = (e) => !boxRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const options = [
    ...(data?.categories || []).map((c) => ({ type: 'category', key: c._id, label: c.name, to: `/products?category=${c.slug}` })),
    ...(data?.products || []).map((p) => ({ type: 'product', key: p._id, label: p.title, image: p.image, price: p.finalPrice, to: `/product/${p.slug}` })),
  ];

  const go = (to) => {
    setOpen(false);
    setActive(-1);
    navigate(to);
  };

  const submit = (e) => {
    e.preventDefault();
    if (active >= 0 && options[active]) return go(options[active].to);
    if (q.trim()) go(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  const onKeyDown = (e) => {
    if (!open || !options.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => (a + 1) % options.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => (a <= 0 ? options.length - 1 : a - 1));
    } else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={boxRef} className={cn('relative', className)}>
      <form onSubmit={submit} role="search" className="relative">
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search for products, brands and more"
          className="h-9 w-full rounded-sm border-0 bg-white pl-4 pr-11 text-sm text-fk-ink shadow-sm placeholder:text-fk-muted focus:outline-none focus:ring-2 focus:ring-fk-yellow/70 sm:h-10 dark:bg-slate-800 dark:text-slate-100"
          aria-label="Search products"
          aria-autocomplete="list"
          aria-expanded={open && options.length > 0}
          role="combobox"
        />
        <button type="submit" className="absolute right-0 top-0 grid h-full w-11 place-items-center text-brand-600 dark:text-brand-400" aria-label="Search">
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-[18px] w-[18px]" strokeWidth={2.5} />}
        </button>
      </form>

      <AnimatePresence>
        {open && debounced.length >= 2 && data && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            role="listbox"
            className="absolute inset-x-0 top-full z-40 mt-0.5 overflow-hidden rounded-sm bg-white py-1 text-fk-ink shadow-lift dark:border-slate-700 dark:bg-slate-900"
          >
            {options.length === 0 && <li className="px-4 py-3 text-sm text-slate-500">No matches for “{debounced}”</li>}
            {options.map((o, i) => (
              <li key={o.key} role="option" aria-selected={i === active}>
                <button onMouseEnter={() => setActive(i)} onClick={() => go(o.to)} className={cn('flex w-full items-center gap-3 px-4 py-2 text-left text-sm', i === active && 'bg-slate-50 dark:bg-slate-800')}>
                  {o.type === 'category' ? (
                    <span className="grid h-9 w-9 place-items-center rounded-sm bg-brand-50 text-brand-600 dark:bg-brand-500/10"><Tag className="h-4 w-4" /></span>
                  ) : (
                    <img src={assetUrl(o.image)} alt="" className="h-9 w-9 rounded-sm object-contain" />
                  )}
                  <span className="min-w-0 flex-1 truncate">{o.type === 'category' ? <>in <b>{o.label}</b></> : o.label}</span>
                  {o.price != null && <span className="font-semibold">{formatPrice(o.price)}</span>}
                </button>
              </li>
            ))}
            {options.length > 0 && (
              <li className="border-t border-slate-100 dark:border-slate-800">
                <button onClick={() => go(`/products?q=${encodeURIComponent(debounced)}`)} className="w-full px-4 py-2.5 text-left text-sm font-semibold text-brand-600">See all results for “{debounced}”</button>
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
