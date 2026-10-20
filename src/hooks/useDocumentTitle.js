import { useEffect } from 'react';

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ShopNest` : 'ShopNest — Simple shopping, delivered';
  }, [title]);
}
