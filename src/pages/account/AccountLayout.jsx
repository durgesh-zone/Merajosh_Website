import { Suspense } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Package, Heart, BookOpen, MapPin, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { PageLoader } from '@/components/ui';
import { cn } from '@/lib/utils';

const LINKS = [
  { to: '/account/orders', label: 'My orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/library', label: 'My library', icon: BookOpen },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/profile', label: 'Profile & security', icon: User },
];

export default function AccountLayout() {
  const { user } = useAuth();
  return (
    <div className="container-page grid gap-3 py-3 lg:grid-cols-[280px_1fr]">
      <aside>
        <div className="card mb-3 flex items-center gap-3 p-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-lg font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
          <div className="min-w-0"><p className="text-xs text-fk-muted">Hello,</p><p className="truncate font-semibold">{user?.name}</p></div>
        </div>
        <nav className="card scrollbar-none flex overflow-x-auto lg:flex-col" aria-label="Account">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => cn('flex items-center gap-3 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition lg:border-b-0 lg:border-l-4 lg:py-3.5', isActive ? 'border-brand-600 bg-brand-50 font-semibold text-brand-600 dark:bg-brand-500/10 dark:text-brand-300' : 'border-transparent text-fk-ink hover:bg-fk-page hover:text-brand-600 dark:text-slate-300 dark:hover:bg-slate-800')}>
              <Icon className="h-[18px] w-[18px] text-brand-600" /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <section className="min-w-0">
        <Suspense fallback={<PageLoader />}><Outlet /></Suspense>
      </section>
    </div>
  );
}
