import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white pb-20 md:pb-0 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-slate-500">Makeup, fresh desserts, toys and instant e-books — simple shopping, delivered to your door.</p>
        </div>
        {[
          ['Shop', [['All products', '/products'], ['E-books', '/products?type=virtual'], ['Makeup', '/products?category=makeup'], ['Desserts', '/products?category=desserts']]],
          ['Account', [['My orders', '/account/orders'], ['My library', '/account/library'], ['Wishlist', '/account/wishlist'], ['Profile', '/account/profile']]],
          ['Help', [['Free delivery above ₹499', '/products'], ['7-day easy returns', '/account/orders'], ['Secure payments', '/cart']]],
        ].map(([title, links]) => (
          <div key={title}>
            <h3 className="text-sm font-bold">{title}</h3>
            <ul className="mt-3 space-y-2">
              {links.map(([label, to]) => (
                <li key={label}><Link to={to} className="text-sm text-slate-500 hover:text-brand-600">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-100 py-5 text-center text-xs text-slate-400 dark:border-slate-800">© {new Date().getFullYear()} ShopNest. All rights reserved.</div>
    </footer>
  );
}
