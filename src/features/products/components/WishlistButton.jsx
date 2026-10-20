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
      className={cn('grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-105 dark:bg-slate-900/90', className)}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={active}
    >
      <Heart className={cn('h-[18px] w-[18px] transition', active ? 'fill-rose-500 text-rose-500' : 'text-slate-500')} />
    </motion.button>
  );
}
