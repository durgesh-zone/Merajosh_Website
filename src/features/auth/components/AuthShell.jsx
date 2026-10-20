import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

/** Split-screen frame for sign in / sign up. */
export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="container-page grid min-h-[calc(100dvh-8rem)] items-center gap-10 py-10 lg:grid-cols-2">
      <div className="relative hidden h-full max-h-[560px] overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-fuchsia-600 p-10 text-white lg:flex lg:flex-col lg:justify-end">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 right-20 h-40 w-40 rounded-full bg-white/10" />
        <Sparkles className="mb-6 h-10 w-10" />
        <h2 className="text-3xl font-extrabold leading-tight">Everything you love,<br />delivered with care.</h2>
        <p className="mt-3 max-w-sm text-white/80">Track orders live, download e-books instantly, and get exclusive member-only deals.</p>
      </div>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-2 text-slate-500">{subtitle}</p>}
        <div className="mt-8">{children}</div>
      </motion.div>
    </div>
  );
}
