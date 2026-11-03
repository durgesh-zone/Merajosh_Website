import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '@/features/cart/useWishlist';
import { cn } from '@/lib/utils';

export function WishlistButton({ productId, className }) {
  const { has, toggle } = useWishlist();
  const active = has(productId);
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={cn('grid h-8 w-8 place-items-center rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.12)] transition hover:scale-105 dark:bg-slate-800', className)}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
    >
      <Heart className={cn('h-[18px] w-[18px] transition', active ? 'fill-[#ff4343] text-[#ff4343]' : 'fill-slate-200 text-slate-300 dark:fill-slate-700 dark:text-slate-600')} />
    </motion.button>
  );
}
