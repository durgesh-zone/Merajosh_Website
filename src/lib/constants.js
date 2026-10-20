export const ORDER_STEPS = [
  { key: 'placed', label: 'Order placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export const STATUS_META = {
  pending_payment: { label: 'Awaiting payment', tone: 'amber' },
  placed: { label: 'Placed', tone: 'brand' },
  confirmed: { label: 'Confirmed', tone: 'brand' },
  packed: { label: 'Packed', tone: 'brand' },
  shipped: { label: 'Shipped', tone: 'sky' },
  out_for_delivery: { label: 'Out for delivery', tone: 'sky' },
  delivered: { label: 'Delivered', tone: 'green' },
  delivery_failed: { label: 'Delivery attempt failed', tone: 'amber' },
  cancelled: { label: 'Cancelled', tone: 'red' },
  return_requested: { label: 'Return requested', tone: 'amber' },
  returned: { label: 'Returned', tone: 'slate' },
};

export const PAYMENT_STATUS_META = {
  pending: { label: 'Payment pending', tone: 'amber' },
  paid: { label: 'Paid', tone: 'green' },
  failed: { label: 'Payment failed', tone: 'red' },
  refund_pending: { label: 'Refund in progress', tone: 'amber' },
  refunded: { label: 'Refunded', tone: 'slate' },
};

export const SORT_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Customer rating' },
];
