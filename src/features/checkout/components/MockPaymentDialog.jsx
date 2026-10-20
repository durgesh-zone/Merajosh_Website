import { CreditCard, ShieldCheck } from 'lucide-react';
import { Button, Modal } from '@/components/ui';
import { formatPrice } from '@/lib/format';

/** Stand-in for Razorpay Checkout while no Razorpay keys are configured (development). */
export function MockPaymentDialog({ state, onResolve }) {
  return (
    <Modal open={Boolean(state)} onClose={() => onResolve('dismissed')} title="Test payment" description="Razorpay keys are not configured, so a test gateway is used." size="sm">
      {state && (
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10"><CreditCard className="h-8 w-8" /></div>
          <p className="mt-4 text-sm text-slate-500">Order {state.payment.orderNumber}</p>
          <p className="text-3xl font-extrabold">{formatPrice(state.payment.amount / 100)}</p>
          <div className="mt-6 grid gap-2">
            <Button variant="success" size="lg" onClick={() => onResolve('success')}><ShieldCheck className="h-5 w-5" /> Simulate successful payment</Button>
            <Button variant="outline" onClick={() => onResolve('failure')}>Simulate failed payment</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
