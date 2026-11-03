import { Link } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, HelpCircle } from 'lucide-react';
import { Logo } from './Logo';

const COLUMNS = [
  ['Shop', [['All products', '/products'], ['E-books', '/products?type=virtual'], ['Makeup', '/products?category=makeup'], ['Desserts', '/products?category=desserts']]],
  ['Account', [['My orders', '/account/orders'], ['My library', '/account/library'], ['Wishlist', '/account/wishlist'], ['Profile', '/account/profile']]],
  ['Help', [['Track your order', '/account/orders'], ['Returns & refunds', '/account/orders'], ['Saved addresses', '/account/addresses'], ['Your cart', '/cart']]],
];

const PROMISES = [
  [Truck, 'Free delivery above ₹499'],
  [RotateCcw, '7-day easy returns'],
  [ShieldCheck, '100% secure payments'],
  [HelpCircle, 'Help centre'],
];

export function Footer() {
  return (
    <footer className="mt-6 bg-fk-navy pb-16 text-white md:pb-0">
      <div className="container-page grid gap-8 py-10 text-sm sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-slate-300">Makeup, fresh desserts, toys and instant e-books — simple shopping, delivered to your door.</p>
        </div>
        {COLUMNS.map(([title, links]) => (
          <div key={title}>
            <h3 className="text-xs font-medium uppercase tracking-wide text-fk-muted">{title}</h3>
            <ul className="mt-3 space-y-2">
              {links.map(([label, to]) => (
                <li key={label}><Link to={to} className="text-[13px] font-medium text-white hover:underline">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-4 py-5 text-[13px] lg:flex-row">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2">
            {PROMISES.map(([Icon, label]) => (
              <li key={label} className="flex items-center gap-2"><Icon className="h-4 w-4 text-fk-yellow" /> {label}</li>
            ))}
          </ul>
          <p className="text-slate-300">© {new Date().getFullYear()} ShopNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
