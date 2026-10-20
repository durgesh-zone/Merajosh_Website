import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui';
import { assetUrl, cn } from '@/lib/utils';

export function HeroSlider({ banners = [], loading }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;
  const go = useCallback((dir) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    const t = setInterval(() => go(1), 5500);
    return () => clearInterval(t);
  }, [count, paused, go]);

  if (loading) return <Skeleton className="aspect-[16/9] w-full rounded-3xl sm:aspect-[16/6]" />;
  if (!count) return null;
  const b = banners[index];

  return (
    <div
      className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-slate-900 shadow-lift sm:aspect-[16/6]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div key={b._id} className="absolute inset-0" initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
          <img src={assetUrl(b.image.url)} alt="" className="h-full w-full object-cover" />
          <div className={cn('absolute inset-0 bg-gradient-to-r', b.theme === 'light' ? 'from-white/80 via-white/30' : 'from-black/60 via-black/20', 'to-transparent')} />
          <div className={cn('absolute inset-0 flex flex-col justify-center px-6 sm:px-14', b.theme === 'light' ? 'text-slate-900' : 'text-white')}>
            <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="max-w-lg text-2xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {b.title}
            </motion.h2>
            {b.subtitle && (
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} className="mt-2 max-w-md text-sm opacity-90 sm:mt-4 sm:text-lg">
                {b.subtitle}
              </motion.p>
            )}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }}>
              <Link to={b.link || '/products'} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition hover:gap-3 sm:mt-7 sm:px-6 sm:py-3">
                {b.ctaText || 'Shop now'} <ArrowRight className="h-4 w-4 transition-all" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          <button onClick={() => go(-1)} className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 sm:grid" aria-label="Previous slide"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={() => go(1)} className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition group-hover:opacity-100 sm:grid" aria-label="Next slide"><ChevronRight className="h-5 w-5" /></button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((x, i) => (
              <button key={x._id} onClick={() => setIndex(i)} className={cn('h-1.5 rounded-full bg-white transition-all', i === index ? 'w-7' : 'w-1.5 opacity-50')} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
