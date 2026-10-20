import { useCallback, useRef, useState } from 'react';
import { useCheckoutPayment } from './useCheckoutPayment';
import { MockPaymentDialog } from './components/MockPaymentDialog';

/**
 * Payment flow shared by checkout and "retry payment".
 * Returns `pay({ order, payment })` and the dialog element to render (used in mock mode).
 */
export function usePaymentFlow() {
  const [mockState, setMockState] = useState(null);
  const resolver = useRef(null);
  const openMock = useCallback((s) => new Promise((resolve) => {
    resolver.current = resolve;
    setMockState(s);
  }), []);
  const resolve = (outcome) => {
    setMockState(null);
    resolver.current?.(outcome);
  };
  const pay = useCheckoutPayment({ openMock });
  return { pay, paymentDialog: <MockPaymentDialog state={mockState} onResolve={resolve} /> };
}
