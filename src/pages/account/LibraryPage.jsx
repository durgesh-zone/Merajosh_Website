import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BookOpen, Download, Loader2 } from 'lucide-react';
import { accountApi } from '@/services/account.api';
import { downloadFile } from '@/services/order.api';
import { getErrorMessage } from '@/lib/api';
import { formatBytes, formatDate } from '@/lib/format';
import { assetUrl } from '@/lib/utils';
import { Button, EmptyState, Skeleton } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function LibraryPage() {
  useDocumentTitle('My library');
  const { data = [], isLoading } = useQuery({ queryKey: ['library'], queryFn: accountApi.library });
  const [busy, setBusy] = useState(null);

  const download = async (item) => {
    setBusy(item.productId);
    try {
      await downloadFile(`/account/library/${item.productId}/download`, `${item.title}.${(item.format || 'pdf').toLowerCase()}`);
      toast.success('Download started');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight">My library</h1>
      <p className="mt-1 text-sm text-slate-500">E-books you've purchased. Downloads are protected and only work while you're signed in.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
      </div>
      {!isLoading && !data.length && <EmptyState icon={BookOpen} title="No e-books yet" description="E-books you buy appear here instantly after payment." action={<Button as={Link} to="/products?type=virtual">Browse e-books</Button>} />}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((item, i) => (
          <motion.div key={item.productId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card flex gap-4 p-4">
            <img src={assetUrl(item.image)} alt="" className="h-28 w-20 shrink-0 rounded-lg object-cover shadow-md" />
            <div className="flex min-w-0 flex-1 flex-col">
              <Link to={`/product/${item.slug}`} className="line-clamp-2 font-bold hover:text-brand-600">{item.title}</Link>
              {item.author && <p className="text-sm text-slate-500">{item.author}</p>}
              <p className="mt-1 text-xs text-slate-400">{[item.format, formatBytes(item.fileSize)].filter(Boolean).join(' · ')} · Bought {formatDate(item.purchasedAt)}</p>
              <Button size="sm" className="mt-auto w-fit" onClick={() => download(item)} disabled={!item.available || busy === item.productId}>
                {busy === item.productId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Download
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
