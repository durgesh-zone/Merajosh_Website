import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { AuthShell } from '@/features/auth/components/AuthShell';
import { loginSchema } from '@/features/auth/schemas';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/api';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function LoginPage() {
  useDocumentTitle('Sign in');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname ? `${location.state.from.pathname}${location.state.from.search || ''}` : '/';
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values) => {
    try {
      const user = await login(values);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError('root', { message: getErrorMessage(err) });
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to track orders, see your library and check out faster.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {errors.root && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{errors.root.message}</div>}
        <Input label="Email" type="email" autoComplete="email" leftIcon={Mail} error={errors.email?.message} {...register('email')} />
        <Input label="Password" type="password" autoComplete="current-password" leftIcon={Lock} error={errors.password?.message} {...register('password')} />
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>Sign in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-500">
        New to ShopNest? <Link to="/register" state={location.state} className="font-semibold text-brand-600 hover:underline">Create an account</Link>
      </p>
      <p className="mt-4 rounded-xl bg-slate-100 p-3 text-center text-xs text-slate-500 dark:bg-slate-800/60">Demo: customer@shopnest.dev / Customer@123</p>
    </AuthShell>
  );
}
