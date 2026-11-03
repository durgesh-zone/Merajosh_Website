import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

/** Italic wordmark with a yellow tagline; designed to sit on the blue header or the navy footer. */
export function Logo({ to = '/' }) {
  return (
    <Link to={to} className="flex shrink-0 flex-col leading-none text-white" aria-label="ShopNest home">
      <span className="text-xl font-extrabold italic tracking-tight">ShopNest</span>
      <span className="mt-0.5 flex items-center gap-0.5 text-[11px] font-medium italic text-white/85">
        Shop <span className="font-bold text-fk-yellow">Smart</span>
        <Sparkles className="h-2.5 w-2.5 fill-fk-yellow text-fk-yellow" aria-hidden />
      </span>
    </Link>
  );
}
