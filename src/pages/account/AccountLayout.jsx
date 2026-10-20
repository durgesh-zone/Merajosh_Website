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
    <div className="container-page grid gap-6 py-6 lg:grid-cols-[260px_1fr]">
      <aside>
        <div className="card mb-4 flex items-center gap-3 p-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-violet-600 text-lg font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
          <div className="min-w-0"><p className="text-xs text-slate-500">Hello,</p><p className="truncate font-bold">{user?.name}</p></div>
        </div>
        <nav className="card scrollbar-none flex gap-1 overflow-x-auto p-2 lg:flex-col" aria-label="Account">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => cn('flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-semibold transition', isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800')}>
              <Icon className="h-4 w-4" /> {label}
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
