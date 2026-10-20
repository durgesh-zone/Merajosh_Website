import { NavLink } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingCart, User, Package } from 'lucide-react';
import { useCart } from '@/features/cart/useCart';
import { cn } from '@/lib/utils';

const ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/products', label: 'Shop', icon: LayoutGrid },
  { to: '/cart', label: 'Cart', icon: ShoppingCart, badge: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/profile', label: 'Account', icon: User },
];

/** Bottom tab bar on phones. */
export function MobileNav() {
  const { count } = useCart();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden dark:border-slate-800 dark:bg-slate-950/95" aria-label="Primary">
      <div className="grid grid-cols-5">
        {ITEMS.map(({ to, label, icon: Icon, end, badge }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => cn('relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold', isActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500')}>
            <Icon className="h-5 w-5" />
            {label}
            {badge && count > 0 && <span className="absolute right-[22%] top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] text-white">{count}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
