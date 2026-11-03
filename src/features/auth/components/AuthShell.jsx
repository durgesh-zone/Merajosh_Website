import { motion } from 'framer-motion';
import { ShoppingBag, Truck, ShieldCheck } from 'lucide-react';

/** Two-panel auth card: blue intro panel on the left, form on the right. */
export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="container-page grid min-h-[calc(100dvh-10rem)] place-items-center py-4 sm:py-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card grid w-full max-w-[860px] overflow-hidden md:grid-cols-[2fr_3fr]">
        <div className="flex flex-col bg-brand-600 px-8 py-8 text-white md:py-10">
          <h1 className="text-[26px] font-semibold">{title}</h1>
          {subtitle && <p className="mt-4 text-[17px] leading-relaxed text-white/80">{subtitle}</p>}
          <ul className="mt-auto hidden space-y-4 pt-10 text-sm text-white/90 md:block">
            <li className="flex items-center gap-3"><ShoppingBag className="h-5 w-5 text-fk-yellow" /> Exclusive member-only deals</li>
            <li className="flex items-center gap-3"><Truck className="h-5 w-5 text-fk-yellow" /> Live order tracking</li>
            <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-fk-yellow" /> Secure, encrypted checkout</li>
          </ul>
        </div>
        <div className="px-6 py-8 sm:px-10 md:py-10">{children}</div>
      </motion.div>
    </div>
  );
}
