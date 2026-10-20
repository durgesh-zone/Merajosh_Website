import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { PackageOpen } from 'lucide-react';
import { orderApi } from '@/services/order.api';
import { OrderCard } from '@/features/orders/components/OrderCard';
import { Button, EmptyState, Pagination, Skeleton, Tabs } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const TABS = [
  { value: '', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  useDocumentTitle('My orders');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({ queryKey: ['orders', { status, page }], queryFn: () => orderApi.list({ status, page, limit: 10 }), placeholderData: keepPreviousData });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight">My orders</h1>
        <Tabs tabs={TABS} value={status} onChange={(v) => { setStatus(v); setPage(1); }} layoutId="order-tabs" />
      </div>
      <div className="space-y-3">
        {isLoading && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {!isLoading && !data?.data.length && <EmptyState icon={PackageOpen} title="No orders here yet" description="When you place an order it will show up here." action={<Button as={Link} to="/products">Start shopping</Button>} />}
        {data?.data.map((o) => <OrderCard key={o._id} order={o} />)}
      </div>
      <Pagination className="mt-6" page={page} totalPages={data?.meta?.totalPages} onChange={setPage} />
    </div>
  );
}
