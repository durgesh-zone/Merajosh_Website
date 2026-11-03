import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Package, Heart, BookOpen, User, LogOut, MapPin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const LINKS = [
  { to: '/account/orders', label: 'My orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/library', label: 'My library', icon: BookOpen },
  { to: '/account/addresses', label: 'Addresses', icon: MapPin },
  { to: '/account/profile', label: 'Profile', icon: User },
];

export function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) {
    return <Link to="/login" className="rounded-sm bg-white px-5 py-1.5 text-[15px] font-semibold text-brand-600 shadow-sm hover:bg-white/95 sm:px-9 dark:bg-brand-600 dark:text-white">Login</Link>;
  }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-white hover:bg-white/10" aria-haspopup="menu" aria-expanded={open}>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-sm font-bold text-brand-600">{user.name[0]?.toUpperCase()}</span>
        <span className="hidden max-w-28 truncate text-[15px] font-semibold lg:block">{user.name.split(' ')[0]}</span>
        <ChevronDown className="hidden h-4 w-4 text-white/80 lg:block" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="menu" initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6 }} className="absolute right-0 z-40 mt-2 w-60 overflow-hidden rounded-sm bg-white py-1 text-fk-ink shadow-lift dark:text-slate-100 dark:ring-1 dark:ring-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-4 pb-3 pt-1 dark:border-slate-800">
              <p className="truncate font-semibold">{user.name}</p>
              <p className="truncate text-xs text-slate-500">{user.email}</p>
            </div>
            {LINKS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} role="menuitem" onClick={() => setOpen(false)} className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-sm hover:bg-fk-page dark:border-slate-800 dark:hover:bg-slate-800">
                <Icon className="h-4 w-4 text-brand-600" /> {label}
              </Link>
            ))}
            <button
              role="menuitem"
              onClick={async () => {
                setOpen(false);
                await logout();
                toast.success('Signed out');
                navigate('/');
              }}
              className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:border-slate-800 dark:hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
