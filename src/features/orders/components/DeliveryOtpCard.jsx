import { motion } from 'framer-motion';
import { KeyRound, Bike } from 'lucide-react';
import { formatDateTime } from '@/lib/format';

/** Shown while the order is out for delivery: the customer reads this OTP to the rider. */
export function DeliveryOtpCard({ otp, deliveryBoy }) {
  if (!otp?.code) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-violet-700 p-6 text-white shadow-lift">
      <div className="flex items-center gap-2 text-sm font-semibold text-white/80"><KeyRound className="h-4 w-4" /> Delivery OTP</div>
      <div className="mt-3 flex gap-2" aria-label={`Delivery OTP ${otp.code.split('').join(' ')}`}>
        {otp.code.split('').map((d, i) => (
          <motion.span key={i} initial={{ rotateX: 90 }} animate={{ rotateX: 0 }} transition={{ delay: 0.1 * i }} className="grid h-14 w-12 place-items-center rounded-xl bg-white/15 text-3xl font-extrabold tabular-nums backdrop-blur">
            {d}
          </motion.span>
        ))}
      </div>
      <p className="mt-4 text-sm text-white/85">Share this code with the delivery partner only when you receive your package. Never share it over a phone call.</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white/70">
        {deliveryBoy && <span className="flex items-center gap-1.5"><Bike className="h-4 w-4" /> {deliveryBoy.name} is on the way</span>}
        <span>Valid till {formatDateTime(otp.expiresAt)}</span>
      </div>
    </motion.div>
  );
}
