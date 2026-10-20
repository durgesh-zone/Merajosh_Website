import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui';

/** Friendly fallback for any error thrown while rendering a route. */
export function RouteError() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error?.message || 'Unknown error';
  if (import.meta.env.DEV) console.error(error);
  return (
    <div className="grid min-h-[60vh] place-items-center p-6 text-center">
      <div className="max-w-md">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10"><AlertTriangle className="h-8 w-8" /></span>
        <h1 className="mt-4 text-xl font-extrabold">Something went wrong</h1>
        <p className="mt-2 text-sm text-slate-500">This page hit an unexpected error. Try reloading; if it keeps happening, share the message below.</p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-100 p-3 text-left text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">{message}</pre>
        <div className="mt-6 flex justify-center gap-3">
          <Button onClick={() => window.location.reload()}>Reload page</Button>
          <Button as={Link} to="/" variant="outline">Home</Button>
        </div>
      </div>
    </div>
  );
}
