import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { MapPin, Plus } from 'lucide-react';
import { accountApi } from '@/services/account.api';
import { getErrorMessage } from '@/lib/api';
import { AddressCard } from '@/features/account/components/AddressCard';
import { AddressFormModal } from '@/features/account/components/AddressForm';
import { Button, ConfirmDialog, EmptyState, Skeleton } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function AddressesPage() {
  useDocumentTitle('Addresses');
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ['addresses'], queryFn: accountApi.addresses });
  const [modal, setModal] = useState({ open: false, address: null });
  const [toDelete, setToDelete] = useState(null);

  const remove = useMutation({
    mutationFn: (id) => accountApi.deleteAddress(id),
    onSuccess: () => { toast.success('Address removed'); queryClient.invalidateQueries({ queryKey: ['addresses'] }); setToDelete(null); },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-extrabold tracking-tight">Saved addresses</h1>
        <Button onClick={() => setModal({ open: true, address: null })}><Plus className="h-4 w-4" /> Add address</Button>
      </div>
      {isLoading && <div className="space-y-3"><Skeleton className="h-28" /><Skeleton className="h-28" /></div>}
      {!isLoading && !data.length && <EmptyState icon={MapPin} title="No saved addresses" description="Add an address for faster checkout." />}
      <div className="grid gap-3 md:grid-cols-2">
        {data.map((a) => <AddressCard key={a._id} address={a} onEdit={() => setModal({ open: true, address: a })} onDelete={() => setToDelete(a)} />)}
      </div>
      <AddressFormModal open={modal.open} address={modal.address} onClose={() => setModal({ open: false, address: null })} />
      <ConfirmDialog open={Boolean(toDelete)} onClose={() => setToDelete(null)} onConfirm={() => remove.mutate(toDelete._id)} loading={remove.isPending} title="Delete this address?" description={toDelete ? `${toDelete.line1}, ${toDelete.city}` : ''} confirmText="Delete" />
    </div>
  );
}
