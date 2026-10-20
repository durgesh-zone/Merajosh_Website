import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { BadgeCheck, MessageSquare, PencilLine } from 'lucide-react';
import { catalogApi } from '@/services/catalog.api';
import { useAuth } from '@/context/AuthContext';
import { Button, Pagination, Select, Skeleton, Stars, EmptyState } from '@/components/ui';
import { formatDate } from '@/lib/format';
import { assetUrl } from '@/lib/utils';
import { RatingBreakdown } from './RatingBreakdown';
import { ReviewForm } from './ReviewForm';

export function ReviewsSection({ product }) {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [rating, setRating] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', product._id, { page, sort, rating }],
    queryFn: () => catalogApi.reviews(product._id, { page, sort, rating, limit: 5 }),
    placeholderData: keepPreviousData,
  });
  const { data: eligibility } = useQuery({
    queryKey: ['review-eligibility', product._id],
    queryFn: () => catalogApi.reviewEligibility(product._id),
    enabled: isAuthenticated,
  });

  const reviews = data?.data?.reviews || [];

  return (
    <section id="reviews" className="card mt-8 p-5 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h2 className="text-xl font-extrabold">Ratings & reviews</h2>
        {eligibility?.canReview && <Button variant="secondary" onClick={() => setFormOpen(true)}><PencilLine className="h-4 w-4" /> Write a review</Button>}
        {eligibility?.review && <Button variant="outline" onClick={() => setFormOpen(true)}><PencilLine className="h-4 w-4" /> Edit your review</Button>}
        {!isAuthenticated && <Link to="/login" className="text-sm font-semibold text-brand-600 hover:underline">Sign in to review</Link>}
      </div>
      {isAuthenticated && eligibility && !eligibility.hasPurchased && (
        <p className="mt-2 text-sm text-slate-500">Only verified buyers can review this product.</p>
      )}

      <div className="mt-6">
        <RatingBreakdown average={product.ratingAverage} count={product.ratingCount} distribution={data?.data?.distribution || []} />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          {['', '5', '4', '3', '2', '1'].map((r) => (
            <button key={r} onClick={() => { setRating(r); setPage(1); }} className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${rating === r ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-200 hover:border-slate-300 dark:border-slate-700'}`}>
              {r ? `${r}★` : 'All'}
            </button>
          ))}
        </div>
        <Select aria-label="Sort reviews" className="w-40" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} options={[{ value: 'newest', label: 'Most recent' }, { value: 'highest', label: 'Highest rated' }, { value: 'lowest', label: 'Lowest rated' }]} />
      </div>

      <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <li key={i} className="space-y-2 py-5"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-full" /><Skeleton className="h-3 w-2/3" /></li>)}
        {!isLoading && !reviews.length && <EmptyState icon={MessageSquare} title="No reviews yet" description={rating ? 'No reviews with this rating.' : 'Be the first to share your thoughts after purchase.'} className="py-10" />}
        {reviews.map((r) => (
          <li key={r._id} className="py-5">
            <div className="flex items-center gap-3">
              <Stars value={r.rating} />
              {r.title && <span className="font-semibold">{r.title}</span>}
            </div>
            {r.comment && <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{r.comment}</p>}
            {r.images?.length > 0 && (
              <div className="mt-3 flex gap-2">
                {r.images.map((img) => (
                  <button key={img.url} onClick={() => setLightbox(img.url)} className="h-16 w-16 overflow-hidden rounded-lg"><img src={assetUrl(img.url)} alt="Review" className="h-full w-full object-cover" /></button>
                ))}
              </div>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
              <b className="font-semibold text-slate-700 dark:text-slate-300">{r.user.name}</b>
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified buyer · {formatDate(r.createdAt)}
            </p>
          </li>
        ))}
      </ul>
      <Pagination page={page} totalPages={data?.meta?.totalPages} onChange={setPage} className="mt-4" />

      <ReviewForm open={formOpen} onClose={() => setFormOpen(false)} productId={product._id} existing={eligibility?.review} />
      {lightbox && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-6" onClick={() => setLightbox(null)} role="dialog" aria-label="Review photo">
          <img src={assetUrl(lightbox)} alt="" className="max-h-full max-w-full rounded-2xl" />
        </div>
      )}
    </section>
  );
}
