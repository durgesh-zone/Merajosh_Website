import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assetUrl, cn } from '@/lib/utils';

export function ProductGallery({ images = [], title }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null);
  const current = images[active]?.url;

  return (
    <div className="flex flex-col-reverse gap-3 md:flex-row">
      {images.length > 1 && (
        <div className="scrollbar-none flex gap-2 overflow-x-auto md:max-h-[520px] md:flex-col md:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className={cn('h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 transition dark:bg-slate-800', i === active ? 'border-brand-500' : 'border-transparent opacity-70 hover:opacity-100')}
              aria-label={`Show image ${i + 1}`}
            >
              <img src={assetUrl(img.url)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      <div
        className="relative aspect-square flex-1 cursor-zoom-in overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
        }}
        onMouseLeave={() => setZoom(null)}
      >
        <AnimatePresence mode="wait">
          {current && (
            <motion.img
              key={current}
              src={assetUrl(current)}
              alt={title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full w-full object-cover transition-transform duration-200"
              style={zoom ? { transform: 'scale(1.6)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
