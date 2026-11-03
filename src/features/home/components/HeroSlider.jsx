import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui';
import { assetUrl, cn } from '@/lib/utils';

/** Full-width banner carousel with white side tabs and dot indicators. */
export function HeroSlider({ banners = [], loading }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = banners.length;
  const go = useCallback((dir) => setIndex((i) => (i + dir + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    const t = setInterval(() => go(1), 5000);
    return () => clearInterval(t);
  }, [count, paused, go]);

  useEffect(() => {
    if (index >= count && count) setIndex(0);
  }, [count, index]);

  if (loading) return <Skeleton className="aspect-[16/8] w-full rounded-sm sm:aspect-[16/5]" />;
  if (!count) return null;
  const b = banners[Math.min(index, count - 1)];

  return (
    <div
      className="group relative aspect-[16/8] w-full overflow-hidden rounded-sm bg-brand-700 shadow-soft sm:aspect-[16/5]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div key={b._id} className="absolute inset-0" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.45 }}>
          <Link to={b.link || '/products'} className="block h-full w-full" aria-label={b.title}>
            <img src={assetUrl(b.image.url)} alt="" className="h-full w-full object-cover" />
            <div className={cn('absolute inset-0 bg-gradient-to-r', b.theme === 'light' ? 'from-white/80 via-white/30' : 'from-black/55 via-black/15', 'to-transparent')} />
            <div className={cn('absolute inset-0 flex flex-col justify-center px-6 sm:px-20', b.theme === 'light' ? 'text-fk-ink' : 'text-white')}>
              <h2 className="max-w-lg text-xl font-extrabold leading-tight tracking-tight sm:text-4xl">{b.title}</h2>
              {b.subtitle && <p className="mt-1.5 max-w-md text-xs opacity-90 sm:mt-3 sm:text-base">{b.subtitle}</p>}
              <span className="mt-3 inline-flex w-fit items-center rounded-sm bg-fk-yellow px-4 py-1.5 text-xs font-bold uppercase text-fk-ink shadow sm:mt-6 sm:px-6 sm:py-2.5 sm:text-sm">
                {b.ctaText || 'Shop now'}
              </span>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {count > 1 && (
        <>
          <button onClick={() => go(-1)} className="absolute left-0 top-1/2 hidden h-24 w-11 -translate-y-1/2 place-items-center rounded-r-sm bg-white/95 text-fk-ink shadow-md sm:grid dark:bg-slate-900/90 dark:text-slate-100" aria-label="Previous slide"><ChevronLeft className="h-6 w-6" /></button>
          <button onClick={() => go(1)} className="absolute right-0 top-1/2 hidden h-24 w-11 -translate-y-1/2 place-items-center rounded-l-sm bg-white/95 text-fk-ink shadow-md sm:grid dark:bg-slate-900/90 dark:text-slate-100" aria-label="Next slide"><ChevronRight className="h-6 w-6" /></button>
          <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((x, i) => (
              <button key={x._id} onClick={() => setIndex(i)} className={cn('h-1.5 rounded-full transition-all', i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50')} aria-label={`Go to slide ${i + 1}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
