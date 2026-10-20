import { Badge } from '@/components/ui';
import { STATUS_META, PAYMENT_STATUS_META } from '@/lib/constants';

export const OrderStatusBadge = ({ status }) => {
  const meta = STATUS_META[status] || { label: status, tone: 'slate' };
  return <Badge tone={meta.tone} dot>{meta.label}</Badge>;
};

export const PaymentStatusBadge = ({ status }) => {
  const meta = PAYMENT_STATUS_META[status] || { label: status, tone: 'slate' };
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
};
