import { Link, NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { catalogApi } from '@/services/catalog.api';
import { useCart } from '@/features/cart/useCart';
import { Logo } from './Logo';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';
import { UserMenu } from './UserMenu';
import { cn } from '@/lib/utils';

export function Header() {
  const { count } = useCart();
  const { data: categories = [] } = useQuery({ queryKey: ['categories', 'tree'], queryFn: () => catalogApi.categories(), staleTime: 300_000 });

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
      <div className="container-page flex h-16 items-center gap-4">
        <Logo />
        <SearchBar className="hidden flex-1 md:block md:max-w-xl lg:ml-6" />
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Link to="/account/wishlist" className="hidden h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 sm:grid dark:text-slate-300 dark:hover:bg-slate-800" aria-label="Wishlist">
            <Heart className="h-5 w-5" />
          </Link>
          <Link to="/cart" className="relative grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" aria-label={`Cart, ${count} items`}>
            <ShoppingCart className="h-5 w-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                  {count > 99 ? '99+' : count}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <div className="ml-1"><UserMenu /></div>
        </div>
      </div>
      <div className="container-page pb-3 md:hidden"><SearchBar /></div>
      <nav className="hidden border-t border-slate-100 md:block dark:border-slate-800/70" aria-label="Categories">
        <div className="container-page scrollbar-none flex gap-1 overflow-x-auto py-1.5">
          <NavLink to="/products" end className={({ isActive }) => cn('whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition', isActive ? 'text-brand-600' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800')}>All products</NavLink>
          {categories.map((c) => (
            <Link key={c._id} to={`/products?category=${c.slug}`} className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">{c.name}</Link>
          ))}
          <Link to="/products?type=virtual" className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10">E-books</Link>
        </div>
      </nav>
    </header>
  );
}
