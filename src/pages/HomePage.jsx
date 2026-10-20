import { useQuery } from '@tanstack/react-query';
import { catalogApi } from '@/services/catalog.api';
import { HeroSlider } from '@/features/home/components/HeroSlider';
import { CategoryStrip } from '@/features/home/components/CategoryStrip';
import { FlashSale } from '@/features/home/components/FlashSale';
import { TrustBar } from '@/features/home/components/TrustBar';
import { ProductRail } from '@/features/products/components/ProductRail';
import { Badge } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function HomePage() {
  useDocumentTitle();
  const { data, isLoading } = useQuery({ queryKey: ['home'], queryFn: catalogApi.home });

  return (
    <div className="container-page pt-4 sm:pt-6">
      <HeroSlider banners={data?.banners} loading={isLoading} />
      <CategoryStrip categories={data?.categories} loading={isLoading} />
      <FlashSale sale={data?.flashSale} />
      <ProductRail title="Featured picks" subtitle="Hand-picked favourites from our team" products={data?.featured} loading={isLoading} viewAllTo="/products?featured=true" />
      <ProductRail title="Best sellers" subtitle="What everyone is buying right now" products={data?.bestSellers} loading={isLoading} viewAllTo="/products?sort=popularity" badge={<Badge tone="amber">🔥 Trending</Badge>} />
      <TrustBar />
      <ProductRail title="New arrivals" subtitle="Fresh in the store this week" products={data?.newArrivals} loading={isLoading} viewAllTo="/products?sort=newest" badge={<Badge tone="green">New</Badge>} />
    </div>
  );
}
