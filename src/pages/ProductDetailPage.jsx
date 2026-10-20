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
    <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
      <Zap className="h-4 w-4 fill-current" /> {name} · ends in {days > 0 && `${days}d `}{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="container-page grid gap-10 py-8 lg:grid-cols-2">
      <Skeleton className="aspect-square rounded-3xl" />
      <div className="space-y-4">
        <Skeleton className="h-4 w-24" /><Skeleton className="h-8 w-3/4" /><Skeleton className="h-5 w-32" /><Skeleton className="h-10 w-48" /><Skeleton className="h-24 w-full" /><Skeleton className="h-12 w-full" />
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

  return (
    <div className="container-page py-6">
      <nav className="mb-5 flex flex-wrap items-center gap-1 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        {product.breadcrumbs.map((c) => (
          <span key={c._id} className="flex items-center gap-1"><ChevronRight className="h-3.5 w-3.5" /><Link to={`/products?category=${c.slug}`} className="hover:text-brand-600">{c.name}</Link></span>
        ))}
        <ChevronRight className="h-3.5 w-3.5" /><span className="truncate text-slate-700 dark:text-slate-300">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="relative lg:sticky lg:top-32 lg:self-start">
          <ProductGallery images={product.images} title={product.title} />
          <WishlistButton productId={product._id} className="absolute right-4 top-4 h-11 w-11" />
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-wrap items-center gap-2">
            {product.brand && <span className="text-sm font-semibold text-brand-600 dark:text-brand-400">{product.brand}</span>}
            {product.isVirtual && <Badge tone="brand"><FileText className="h-3 w-3" /> E-book · {product.digitalMeta?.format || 'PDF'}</Badge>}
          </div>
          <h1 className="mt-1.5 text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">{product.title}</h1>
          <a href="#reviews" className="mt-3 inline-block"><RatingPill value={product.ratingAverage} count={product.ratingCount} /></a>

          <div className="mt-5">
            {discount > 0 && <p className="text-sm font-semibold text-emerald-600">Special price</p>}
            <PriceTag size="lg" price={price} mrp={mrp} discountPercent={discount} />
            <p className="mt-1 text-xs text-slate-500">Inclusive of all taxes</p>
            {product.activeOffer && <OfferTimer endsAt={product.activeOffer.endsAt} name={product.activeOffer.name} />}
          </div>

          <div className="mt-6 space-y-6">
            <VariantSelector variants={product.variants} value={variantId} onChange={setVariantId} />

            {!product.isVirtual && (
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">Quantity</span>
                <QuantityStepper value={qty} onChange={setQty} max={Math.max(1, Math.min(10, stock))} disabled={outOfStock || needsVariant} />
                <span className={`text-sm font-semibold ${outOfStock ? 'text-rose-600' : stock <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {needsVariant ? '' : outOfStock ? 'Out of stock' : stock <= 5 ? `Only ${stock} left!` : 'In stock'}
                </span>
              </div>
            )}

            {owned ? (
              <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-500/10">
                <p className="flex items-center gap-2 font-semibold text-emerald-700 dark:text-emerald-300"><Check className="h-5 w-5" /> You own this e-book</p>
                <Button as={Link} to="/account/library" variant="success" className="mt-3"><Download className="h-4 w-4" /> Go to My Library</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {inCart ? (
                  <Button size="lg" variant="outline" onClick={() => navigate('/cart')}><ShoppingCart className="h-5 w-5" /> Go to cart</Button>
                ) : (
                  <Button size="lg" variant="outline" onClick={() => add(false)} loading={isAdding} disabled={outOfStock}><ShoppingCart className="h-5 w-5" /> Add to cart</Button>
                )}
                <Button size="lg" variant="accent" onClick={() => add(true)} disabled={outOfStock}><Zap className="h-5 w-5" /> Buy now</Button>
              </div>
            )}
          </div>

          <ul className="mt-8 grid gap-3 rounded-2xl border border-slate-200 p-4 text-sm sm:grid-cols-3 dark:border-slate-800">
            {product.isVirtual ? (
              <>
                <li className="flex items-center gap-2"><Download className="h-4 w-4 text-brand-500" /> Instant download</li>
                <li className="flex items-center gap-2"><FileText className="h-4 w-4 text-brand-500" /> {product.digitalMeta?.pages ? `${product.digitalMeta.pages} pages` : 'PDF format'}</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-500" /> {formatBytes(product.digitalMeta?.fileSize) || 'Secure link'}</li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-2"><Truck className="h-4 w-4 text-brand-500" /> Free delivery over ₹499</li>
                <li className="flex items-center gap-2"><RotateCcw className="h-4 w-4 text-brand-500" /> 7-day returns</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-500" /> Cash on Delivery</li>
              </>
            )}
          </ul>

          <div className="mt-8">
            <h2 className="text-lg font-bold">About this item</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-400">{product.description}</p>
            {product.isVirtual && product.digitalMeta?.author && <p className="mt-3 text-sm"><b>Author:</b> {product.digitalMeta.author}</p>}
            {product.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((t) => <Link key={t} to={`/products?q=${encodeURIComponent(t)}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300">#{t}</Link>)}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <ReviewsSection product={product} />
      <ProductRail title="You may also like" products={product.related} />
    </div>
  );
}
