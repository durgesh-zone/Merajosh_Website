import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { PageLoader } from '@/components/ui';
import { useOrderUpdates } from '@/hooks/useOrderUpdates';
import { useScrollTop } from '@/hooks/useScrollTop';

export function StoreLayout() {
  useOrderUpdates();
  useScrollTop();
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <Header />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageLoader />} key={pathname}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
