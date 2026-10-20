import { Truck, ShieldCheck, RotateCcw, Download } from 'lucide-react';

const ITEMS = [
  { icon: Truck, title: 'Free delivery', text: 'On orders above ₹499' },
  { icon: ShieldCheck, title: 'Secure payments', text: 'Razorpay & Cash on Delivery' },
  { icon: RotateCcw, title: 'Easy returns', text: '7-day return window' },
  { icon: Download, title: 'Instant e-books', text: 'Read right after payment' },
];

export function TrustBar() {
  return (
    <section className="my-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {ITEMS.map(({ icon: Icon, title, text }) => (
        <div key={title} className="card flex items-center gap-3 p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300"><Icon className="h-5 w-5" /></span>
          <div>
            <p className="text-sm font-bold">{title}</p>
            <p className="text-xs text-slate-500">{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
