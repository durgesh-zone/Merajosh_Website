import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export function Logo({ to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2" aria-label="ShopNest home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-md shadow-brand-600/30">
        <ShoppingBag className="h-5 w-5" />
      </span>
      <span className="text-lg font-extrabold tracking-tight">Shop<span className="text-brand-600 dark:text-brand-400">Nest</span></span>
    </Link>
  );
}
