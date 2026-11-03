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
    <header className="sticky top-0 z-30 shadow-md">
      <div className="bg-brand-600 text-white dark:bg-slate-900">
        <div className="container-page flex h-14 items-center gap-3 sm:gap-6">
          <Logo />
          <SearchBar className="hidden flex-1 md:block md:max-w-2xl" />
          <div className="ml-auto flex items-center gap-1 sm:gap-3">
            <UserMenu />
            <Link to="/account/wishlist" className="hidden items-center gap-1.5 rounded-sm px-2 py-2 text-[15px] font-semibold hover:bg-white/10 lg:flex" aria-label="Wishlist">
              <Heart className="h-5 w-5" /> <span className="hidden xl:inline">Wishlist</span>
            </Link>
            <Link to="/cart" className="relative flex items-center gap-1.5 rounded-sm px-2 py-2 text-[15px] font-semibold hover:bg-white/10" aria-label={`Cart, ${count} items`}>
              <span className="relative">
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span key={count} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-2 -top-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-fk-orange px-1 text-[10px] font-bold text-white ring-2 ring-brand-600 dark:ring-slate-900">
                      {count > 99 ? '99+' : count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="hidden sm:inline">Cart</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <div className="container-page pb-2.5 md:hidden"><SearchBar /></div>
      </div>
      <nav className="hidden bg-white md:block dark:bg-slate-900 dark:ring-1 dark:ring-slate-800" aria-label="Categories">
        <div className="container-page scrollbar-none flex justify-start gap-1 overflow-x-auto lg:justify-center">
          <NavLink to="/products" end className={({ isActive }) => cn('whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition', isActive ? 'border-brand-600 text-brand-600' : 'border-transparent text-fk-ink hover:text-brand-600 dark:text-slate-300')}>All products</NavLink>
          {categories.map((c) => (
            <Link key={c._id} to={`/products?category=${c.slug}`} className="whitespace-nowrap border-b-2 border-transparent px-4 py-2.5 text-sm font-semibold text-fk-ink transition hover:text-brand-600 dark:text-slate-300">{c.name}</Link>
          ))}
          <Link to="/products?type=virtual" className="whitespace-nowrap border-b-2 border-transparent px-4 py-2.5 text-sm font-semibold text-fk-ink transition hover:text-brand-600 dark:text-slate-300">E-books</Link>
        </div>
      </nav>
    </header>
  );
}
