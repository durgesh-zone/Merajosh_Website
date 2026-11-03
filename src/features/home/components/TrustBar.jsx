import { Truck, ShieldCheck, RotateCcw, Download } from 'lucide-react';

const ITEMS = [
  { icon: Truck, title: 'Free delivery', text: 'On orders above ₹499' },
  { icon: ShieldCheck, title: 'Secure payments', text: 'Razorpay & Cash on Delivery' },
  { icon: RotateCcw, title: 'Easy returns', text: '7-day return window' },
  { icon: Download, title: 'Instant e-books', text: 'Read right after payment' },
];

export function TrustBar() {
  return (
    <section className="card grid grid-cols-2 divide-slate-100 lg:grid-cols-4 lg:divide-x dark:divide-slate-800">
      {ITEMS.map(({ icon: Icon, title, text }) => (
        <div key={title} className="flex items-center gap-3 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300"><Icon className="h-5 w-5" /></span>
          <div>
            <p className="text-sm font-semibold">{title}</p>
            <p className="text-xs text-fk-muted">{text}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
