import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ImagePlus, X } from 'lucide-react';
import { Button, Input, Modal, StarInput, Textarea } from '@/components/ui';
import { catalogApi } from '@/services/catalog.api';
import { getErrorMessage } from '@/lib/api';
import { assetUrl } from '@/lib/utils';

/** Create or edit a review (with up to 4 photos). */
export function ReviewForm({ open, onClose, productId, existing }) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(existing?.rating || 0);
  const [title, setTitle] = useState(existing?.title || '');
  const [comment, setComment] = useState(existing?.comment || '');
  const [keep, setKeep] = useState(existing?.images?.map((i) => i.url) || []);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setRating(existing?.rating || 0);
      setTitle(existing?.title || '');
      setComment(existing?.comment || '');
      setKeep(existing?.images?.map((i) => i.url) || []);
      setFiles([]);
      setError('');
    }
  }, [open, existing]);

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('rating', rating);
      fd.append('title', title);
      fd.append('comment', comment);
      files.forEach((f) => fd.append('images', f));
      if (existing) {
        fd.append('keepImages', JSON.stringify(keep));
        return catalogApi.updateReview(existing._id, fd);
      }
      return catalogApi.createReview(productId, fd);
    },
    onSuccess: () => {
      toast.success(existing ? 'Review updated' : 'Thanks for your review!');
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['review-eligibility', productId] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      onClose();
    },
    onError: (err) => setError(getErrorMessage(err)),
  });

  const totalImages = keep.length + files.length;
  const onPick = (e) => {
    const picked = [...e.target.files].filter((f) => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    if (picked.length < e.target.files.length) toast.error('Only images up to 5 MB are allowed');
    setFiles((f) => [...f, ...picked].slice(0, 4 - keep.length));
    e.target.value = '';
  };

  const submit = (e) => {
    e.preventDefault();
    if (!rating) return setError('Please choose a star rating');
    if (comment.length > 2000) return setError('Review is too long (max 2000 characters)');
    setError('');
    mutation.mutate();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={existing ? 'Edit your review' : 'Write a review'}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={submit} loading={mutation.isPending}>{existing ? 'Save changes' : 'Submit review'}</Button></>}
    >
      <form onSubmit={submit} className="space-y-5">
        {error && <p role="alert" className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}
        <div>
          <p className="label">Your rating</p>
          <StarInput value={rating} onChange={setRating} />
        </div>
        <Input label="Title (optional)" maxLength={120} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Sum it up in a few words" />
        <Textarea label="Your review" rows={4} maxLength={2000} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you like or dislike?" hint={`${comment.length}/2000`} />
        <div>
          <p className="label">Photos (optional, up to 4)</p>
          <div className="flex flex-wrap gap-2">
            {keep.map((url) => (
              <div key={url} className="relative h-20 w-20 overflow-hidden rounded-xl">
                <img src={assetUrl(url)} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setKeep((k) => k.filter((u) => u !== url))} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white" aria-label="Remove photo"><X className="h-3 w-3" /></button>
              </div>
            ))}
            {files.map((f, i) => (
              <div key={`${f.name}${i}`} className="relative h-20 w-20 overflow-hidden rounded-xl">
                <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setFiles((x) => x.filter((_, j) => j !== i))} className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white" aria-label="Remove photo"><X className="h-3 w-3" /></button>
              </div>
            ))}
            {totalImages < 4 && (
              <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400 hover:border-brand-400 hover:text-brand-500 dark:border-slate-700">
                <ImagePlus className="h-6 w-6" />
                <input type="file" accept="image/*" multiple className="sr-only" onChange={onPick} />
              </label>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
