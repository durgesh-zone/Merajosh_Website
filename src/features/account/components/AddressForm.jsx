import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button, Checkbox, Input, Modal, Select } from '@/components/ui';
import { accountApi } from '@/services/account.api';
import { getErrorMessage, getFieldErrors } from '@/lib/api';
import { phoneRule } from '@/features/auth/schemas';

const STATES = ['Andhra Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'];

const schema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  phone: phoneRule,
  pincode: z.string().trim().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  line1: z.string().trim().min(3, 'House no., building and street are required'),
  line2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().min(2, 'Select a state'),
  type: z.enum(['home', 'work', 'other']),
  isDefault: z.boolean().optional(),
});

const EMPTY = { fullName: '', phone: '', pincode: '', line1: '', line2: '', landmark: '', city: '', state: '', type: 'home', isDefault: false };

/** Modal form to add or edit an address. Calls onSaved(address) on success. */
export function AddressFormModal({ open, onClose, address, onSaved }) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm({ resolver: zodResolver(schema), defaultValues: EMPTY });

  useEffect(() => {
    if (open) reset(address ? { ...EMPTY, ...address } : EMPTY);
  }, [open, address, reset]);

  const mutation = useMutation({
    mutationFn: (values) => (address ? accountApi.updateAddress(address._id, values) : accountApi.createAddress(values)),
    onSuccess: (saved) => {
      toast.success(address ? 'Address updated' : 'Address saved');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      onSaved?.(saved);
      onClose();
    },
    onError: (err) => {
      const fields = getFieldErrors(err);
      Object.entries(fields).forEach(([k, message]) => setError(k, { message }));
      if (!Object.keys(fields).length) toast.error(getErrorMessage(err));
    },
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={address ? 'Edit address' : 'Add a new address'}
      footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit((v) => mutation.mutate(v))} loading={mutation.isPending}>Save address</Button></>}
    >
      <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit((v) => mutation.mutate(v))} noValidate>
        <Input label="Full name" autoComplete="name" error={errors.fullName?.message} {...register('fullName')} />
        <Input label="Mobile number" inputMode="numeric" maxLength={10} autoComplete="tel" error={errors.phone?.message} {...register('phone')} />
        <Input label="Pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" error={errors.pincode?.message} {...register('pincode')} />
        <Input label="City / Town" autoComplete="address-level2" error={errors.city?.message} {...register('city')} />
        <Input className="sm:col-span-2" label="House no., building, street" autoComplete="address-line1" error={errors.line1?.message} {...register('line1')} />
        <Input className="sm:col-span-2" label="Area, locality (optional)" autoComplete="address-line2" {...register('line2')} />
        <Input label="Landmark (optional)" {...register('landmark')} />
        <Select label="State" placeholder="Select state" options={STATES.map((s) => ({ value: s, label: s }))} error={errors.state?.message} {...register('state')} />
        <div className="sm:col-span-2">
          <p className="label">Address type</p>
          <div className="flex gap-4">
            {['home', 'work', 'other'].map((t) => (
              <label key={t} className="flex cursor-pointer items-center gap-2 text-sm capitalize"><input type="radio" value={t} className="accent-brand-600" {...register('type')} /> {t}</label>
            ))}
          </div>
        </div>
        <Checkbox className="sm:col-span-2" label="Make this my default address" {...register('isDefault')} />
      </form>
    </Modal>
  );
}
