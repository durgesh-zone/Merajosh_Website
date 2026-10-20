import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/format';
import { assetUrl } from '@/lib/utils';
import { OrderStatusBadge } from './OrderStatusBadge';

export function OrderCard({ order }) {
  const first = order.items[0];
  const more = order.items.length - 1;
  return (
    <Link to={`/account/orders/${order._id}`} className="card flex items-center gap-4 p-4 transition hover:shadow-lift">
      <div className="flex -space-x-4">
        {order.items.slice(0, 3).map((i) => (
          <img key={i._id} src={assetUrl(i.image)} alt="" className="h-16 w-16 rounded-xl border-2 border-white object-cover dark:border-slate-900" />
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <span className="text-xs text-slate-500">{formatDate(order.createdAt)}</span>
        </div>
        <p className="mt-1.5 line-clamp-1 font-semibold">{first?.title}{more > 0 && <span className="font-normal text-slate-500"> + {more} more</span>}</p>
        <p className="text-sm text-slate-500">{order.orderNumber} · <b className="text-slate-700 dark:text-slate-300">{formatPrice(order.pricing.total)}</b> · {order.payment.method === 'cod' ? 'Cash on delivery' : 'Paid online'}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
    </Link>
  );
}
