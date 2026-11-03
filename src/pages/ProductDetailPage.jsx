import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ShoppingCart, Zap, Truck, ShieldCheck, RotateCcw, Download, FileText, ChevronRight, PackageX, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { catalogApi } from '@/services/catalog.api';
import { useCart } from '@/features/cart/useCart';
import { useAuth } from '@/context/AuthContext';
import { ProductGallery } from '@/features/products/components/ProductGallery';
import { VariantSelector } from '@/features/products/components/VariantSelector';
import { PriceTag } from '@/features/products/components/PriceTag';
import { WishlistButton } from '@/features/products/components/WishlistButton';
import { ProductRail } from '@/features/products/components/ProductRail';
import { ReviewsSection } from '@/features/reviews/components/ReviewsSection';
import { Badge, Button, EmptyState, QuantityStepper, RatingPill, Skeleton } from '@/components/ui';
import { useCountdown } from '@/hooks/useCountdown';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatBytes } from '@/lib/format';

function OfferTimer({ endsAt, name }) {
  const { days, hours, minutes, seconds, done } = useCountdown(endsAt);
  if (done) return null;
  return (
    <div className="mt-3 inline-flex items-center gap-2 rounded-sm bg-orange-50 px-3 py-2 text-sm font-semibold text-fk-orange dark:bg-orange-500/10">
      <Zap className="h-4 w-4 fill-current" /> {name} · ends in {days > 0 && `${days}d `}{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="container-page py-3">
      <div className="card grid gap-8 p-5 lg:grid-cols-[5fr_7fr]">
      <Skeleton className="aspect-square" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-3/4" /><Skeleton className="h-5 w-32" /><Skeleton className="h-10 w-48" /><Skeleton className="h-24 w-full" /><Skeleton className="h-12 w-full" />
      </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem, isAdding, items } = useCart();
  const { data: product, isLoading, error } = useQuery({ queryKey: ['product', slug], queryFn: () => catalogApi.product(slug) });
  const [variantId, setVariantId] = useState(null);
  const [qty, setQty] = useState(1);
  useDocumentTitle(product?.title);

  useEffect(() => {
    setQty(1);
    setVariantId(product?.variants?.find((v) => v.stock > 0)?._id || null);
  }, [product?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <DetailSkeleton />;
  if (error || !product) {
    return <div className="container-page py-16"><EmptyState icon={PackageX} title="Product not found" description="It may have been removed or is no longer available." action={<Button as={Link} to="/products">Browse products</Button>} /></div>;
  }

  const variant = product.variants.find((v) => v._id === variantId);
  const price = variant ? variant.finalPrice : product.finalPrice;
  const mrp = variant ? variant.mrp : product.mrp;
  const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const stock = product.isVirtual ? Infinity : variant ? variant.stock : product.stock;
  const needsVariant = product.variants.length > 0 && !variant;
  const outOfStock = !product.isVirtual && stock <= 0;
  const inCart = items.some((i) => (i.product?._id || i.productId) === product._id && String(i.variantId || i.variant?._id || '') === String(variantId || ''));
  const owned = product.isVirtual && product.viewer?.purchased;

  const add = async (buyNow = false) => {
    if (needsVariant) return toast.error(`Please select a ${product.variants[0].label.toLowerCase()}`);
    if (buyNow) {
      if (!isAuthenticated) {
        await addItem({ product, variantId, quantity: qty, silent: true });
        return navigate('/login', { state: { from: { pathname: '/checkout' } } });
      }
      return navigate('/checkout', { state: { buyNow: [{ product: product._id, variantId, quantity: product.isVirtual ? 1 : qty }] } });
    }
    await addItem({ product, variantId, quantity: qty });
  };

  const actions = (mobile) => (owned ? (
    <div className={mobile ? 'flex items-center justify-between gap-3 bg-white px-4 py-2.5 shadow-[0_-2px_6px_rgba(0,0,0,0.08)] dark:bg-slate-900' : 'rounded-sm bg-green-50 p-4 dark:bg-green-500/10'}>
      <p className="flex items-center gap-2 text-sm font-semibold text-fk-green"><Check className="h-5 w-5" /> You own this e-book</p>
      <Button as={Link} to="/account/library" variant="success" size={mobile ? 'sm' : 'md'} className={mobile ? '' : 'mt-3'}><Download className="h-4 w-4" /> My Library</Button>
    </div>
  ) : (
    <div className={mobile ? 'grid grid-cols-2' : 'grid grid-cols-2 gap-2.5'}>
      {inCart ? (
        <Button size="lg" variant="cart" className={mobile ? 'h-12 rounded-none uppercase' : 'h-14 uppercase'} onClick={() => navigate('/cart')}><ShoppingCart className="h-5 w-5" /> Go to cart</Button>
      ) : (
        <Button size="lg" variant="cart" className={mobile ? 'h-12 rounded-none uppercase' : 'h-14 uppercase'} onClick={() => add(false)} loading={isAdding} disabled={outOfStock}><ShoppingCart className="h-5 w-5" /> Add to cart</Button>
      )}
      <Button size="lg" variant="buy" className={mobile ? 'h-12 rounded-none uppercase' : 'h-14 uppercase'} onClick={() => add(true)} disabled={outOfStock}><Zap className="h-5 w-5 fill-current" /> Buy now</Button>
    </div>
  ));

  const services = product.isVirtual
    ? [[Download, 'Instant download after payment'], [FileText, product.digitalMeta?.pages ? `${product.digitalMeta.pages} pages · ${product.digitalMeta?.format || 'PDF'}` : 'PDF format'], [ShieldCheck, formatBytes(product.digitalMeta?.fileSize) || 'Secure download link']]
    : [[Truck, price >= 499 ? 'Free delivery' : 'Free delivery on orders above ₹499'], [RotateCcw, '7 days return policy'], [ShieldCheck, 'Cash on Delivery available']];

  return (
    <div className="container-page pb-28 pt-2.5 sm:pt-3 lg:pb-3">
      <div className="card grid gap-6 p-3 sm:p-5 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
        <div className="lg:sticky lg:top-[120px] lg:self-start">
          <div className="relative rounded-sm border border-slate-100 p-2 dark:border-slate-800">
            <ProductGallery images={product.images} title={product.title} />
            <WishlistButton productId={product._id} className="absolute right-4 top-4 h-10 w-10" />
          </div>
          <div className="mt-3 hidden lg:block">{actions(false)}</div>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="min-w-0">
          <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs text-fk-muted" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-600">Home</Link>
            {product.breadcrumbs.map((c) => (
              <span key={c._id} className="flex items-center gap-1"><ChevronRight className="h-3 w-3" /><Link to={`/products?category=${c.slug}`} className="hover:text-brand-600">{c.name}</Link></span>
            ))}
          </nav>
          <div className="flex flex-wrap items-center gap-2">
            {product.brand && <span className="text-sm font-medium text-fk-muted">{product.brand}</span>}
            {product.isVirtual && <Badge tone="brand"><FileText className="h-3 w-3" /> E-book · {product.digitalMeta?.format || 'PDF'}</Badge>}
          </div>
          <h1 className="mt-1 text-lg leading-snug text-fk-ink sm:text-xl dark:text-slate-100">{product.title}</h1>
          <a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-fk-muted">
            <RatingPill value={product.ratingAverage} count={product.ratingCount} />
            {product.ratingCount > 0 ? null : <span>Be the first to review</span>}
          </a>

          <div className="mt-4">
            {discount > 0 && <p className="text-sm font-semibold text-fk-green">Special price</p>}
            <PriceTag size="lg" price={price} mrp={mrp} discountPercent={discount} />
            <p className="text-xs text-fk-muted">Inclusive of all taxes</p>
            {product.activeOffer && <OfferTimer endsAt={product.activeOffer.endsAt} name={product.activeOffer.name} />}
          </div>

          <div className="mt-6 space-y-5">
            <VariantSelector variants={product.variants} value={variantId} onChange={setVariantId} />

            {!product.isVirtual && (
              <div className="flex items-center gap-4">
                <span className="w-24 text-sm font-medium text-fk-muted">Quantity</span>
                <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, Math.min(10, stock))} disabled={outOfStock || needsVariant} />
                <span className={`text-sm font-semibold ${outOfStock ? 'text-rose-600' : stock <= 5 ? 'text-fk-orange' : 'text-fk-green'}`}>
                  {needsVariant ? '' : outOfStock ? 'Out of stock' : stock <= 5 ? `Hurry, only ${stock} left!` : 'In stock'}
                </span>
              </div>
            )}

            <div className="flex gap-4">
              <span className="w-24 shrink-0 text-sm font-medium text-fk-muted">{product.isVirtual ? 'Delivery' : 'Services'}</span>
              <ul className="space-y-2 text-sm">
                {services.map(([Icon, text]) => (
                  <li key={text} className="flex items-center gap-2"><Icon className="h-4 w-4 text-brand-600" /> {text}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-sm border border-slate-200 dark:border-slate-800">
            <h2 className="border-b border-slate-200 px-4 py-3 text-lg font-semibold sm:px-6 dark:border-slate-800">Product description</h2>
            <div className="px-4 py-4 sm:px-6">
              <p className="whitespace-pre-line text-sm leading-relaxed text-fk-ink dark:text-slate-300">{product.description}</p>
              {product.isVirtual && product.digitalMeta?.author && <p className="mt-3 text-sm"><b>Author:</b> {product.digitalMeta.author}</p>}
              {product.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((t) => <Link key={t} to={`/products?q=${encodeURIComponent(t)}`} className="rounded-sm bg-slate-100 px-2.5 py-1 text-xs font-medium text-fk-ink hover:text-brand-600 dark:bg-slate-800 dark:text-slate-300">#{t}</Link>)}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <ReviewsSection product={product} />
      <div className="mt-3"><ProductRail title="Similar products" products={product.related} /></div>

      {/* Sticky action bar on phones, above the bottom tab bar */}
      <div className="fixed inset-x-0 bottom-[58px] z-20 lg:hidden">{actions(true)}</div>
    </div>
  );
}
