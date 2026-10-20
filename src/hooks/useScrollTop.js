import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Scrolls to the top when the path changes (not on query-string changes). */
export function useScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
}
