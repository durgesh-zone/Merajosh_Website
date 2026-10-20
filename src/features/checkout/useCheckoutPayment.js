import { useCallback } from 'react';
import { orderApi } from '@/services/order.api';
import { getErrorMessage } from '@/lib/api';

const RAZORPAY_SRC = 'https://checkout.razorpay.com/v1/checkout.js';
let scriptPromise = null;

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true);
  scriptPromise ||= new Promise((resolve) => {
    const s = document.createElement('script');
    s.src = RAZORPAY_SRC;
    s.onload = () => resolve(true);
    s.onerror = () => {
      scriptPromise = null;
      resolve(false);
    };
    document.body.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Opens the payment UI for an order and resolves with the verified order.
 * - Real Razorpay: opens Razorpay Checkout, then verifies the signature on the server.
 * - Mock mode (no keys in development): `openMock` shows our own test dialog.
 */
export function useCheckoutPayment({ openMock }) {
  return useCallback(
    async ({ order, payment }) => {
      if (payment.mock) {
        const outcome = await openMock({ order, payment });
        if (outcome === 'dismissed') {
          await orderApi.reportFailure(order._id, 'Payment window closed').catch(() => {});
          throw new Error('Payment was not completed. You can retry from your order page.');
        }
        return orderApi.completeMock(order._id, outcome);
      }

      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Could not load Razorpay. Check your connection and try again.');

      return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: payment.keyId,
          amount: payment.amount,
          currency: payment.currency,
          order_id: payment.gatewayOrderId,
          name: 'ShopNest',
          description: `Order ${payment.orderNumber}`,
          prefill: payment.prefill,
          theme: { color: '#4f46e5' },
          handler: async (response) => {
            try {
              const verified = await orderApi.verifyPayment({
                orderId: order._id,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              resolve(verified);
            } catch (err) {
              reject(new Error(getErrorMessage(err)));
            }
          },
          modal: {
            ondismiss: () => {
              orderApi.reportFailure(order._id, 'Payment window closed').catch(() => {});
              reject(new Error('Payment was not completed. You can retry from your order page.'));
            },
          },
        });
        rzp.on('payment.failed', (resp) => {
          orderApi.reportFailure(order._id, resp.error?.description).catch(() => {});
        });
        rzp.open();
      });
    },
    [openMock],
  );
}
