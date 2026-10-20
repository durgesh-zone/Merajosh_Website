import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { accountApi } from '@/services/account.api';
import { ProductGrid } from '@/features/products/components/ProductGrid';
import { Button, EmptyState } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function WishlistPage() {
  useDocumentTitle('Wishlist');
  const { data = [], isLoading } = useQuery({ queryKey: ['wishlist', 'items'], queryFn: accountApi.wishlist });
  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight">Wishlist {data.length > 0 && <span className="text-base font-medium text-slate-500">({data.length})</span>}</h1>
      {!isLoading && !data.length ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" description="Tap the heart on any product to save it for later." action={<Button as={Link} to="/products">Discover products</Button>} />
      ) : (
        <ProductGrid products={data} loading={isLoading} skeletonCount={6} />
      )}
    </div>
  );
}
