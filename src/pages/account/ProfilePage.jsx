import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { authApi } from '@/services/auth.api';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/api';
import { formatDate } from '@/lib/format';
import { passwordRule, phoneRule } from '@/features/auth/schemas';
import { Button, Input } from '@/components/ui';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

const profileSchema = z.object({ name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80), phone: z.union([phoneRule, z.literal('')]) });
const passwordSchema = z
  .object({ currentPassword: z.string().min(1, 'Current password is required'), newPassword: passwordRule, confirm: z.string() })
  .refine((d) => d.newPassword === d.confirm, { message: 'Passwords do not match', path: ['confirm'] });

export default function ProfilePage() {
  useDocumentTitle('Profile');
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const profile = useForm({ resolver: zodResolver(profileSchema), defaultValues: { name: '', phone: '' } });
  useEffect(() => profile.reset({ name: user?.name || '', phone: user?.phone || '' }), [user]); // eslint-disable-line react-hooks/exhaustive-deps
  const pwd = useForm({ resolver: zodResolver(passwordSchema) });

  const saveProfile = async (values) => {
    try {
      setUser(await authApi.updateProfile(values));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };
  const changePassword = async ({ currentPassword, newPassword }) => {
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      toast.success('Password changed. Other devices were signed out.');
      pwd.reset({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      pwd.setError('currentPassword', { message: getErrorMessage(err) });
    }
  };

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-extrabold tracking-tight">Profile & security</h1>
      <form onSubmit={profile.handleSubmit(saveProfile)} className="card space-y-4 p-5 sm:p-6" noValidate>
        <h2 className="font-bold">Personal information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" error={profile.formState.errors.name?.message} {...profile.register('name')} />
          <Input label="Mobile number" inputMode="numeric" maxLength={10} error={profile.formState.errors.phone?.message} {...profile.register('phone')} />
          <Input label="Email" value={user?.email || ''} disabled hint="Email can't be changed" />
          <Input label="Member since" value={formatDate(user?.createdAt)} disabled />
        </div>
        <Button type="submit" loading={profile.formState.isSubmitting} disabled={!profile.formState.isDirty}>Save changes</Button>
      </form>

      <form onSubmit={pwd.handleSubmit(changePassword)} className="card space-y-4 p-5 sm:p-6" noValidate>
        <h2 className="font-bold">Change password</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <Input type="password" label="Current password" autoComplete="current-password" error={pwd.formState.errors.currentPassword?.message} {...pwd.register('currentPassword')} />
          <Input type="password" label="New password" autoComplete="new-password" error={pwd.formState.errors.newPassword?.message} {...pwd.register('newPassword')} />
          <Input type="password" label="Confirm new password" autoComplete="new-password" error={pwd.formState.errors.confirm?.message} {...pwd.register('confirm')} />
        </div>
        <Button type="submit" variant="secondary" loading={pwd.formState.isSubmitting}>Update password</Button>
      </form>

      <Button variant="outline" className="text-rose-600" onClick={async () => { await logout(); navigate('/'); }}><LogOut className="h-4 w-4" /> Sign out</Button>
    </div>
  );
}
