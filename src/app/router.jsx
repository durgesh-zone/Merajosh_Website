import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { StoreLayout } from '@/components/layout/StoreLayout';
import { RequireAuth, GuestOnly } from './RequireAuth';
import HomePage from '@/pages/HomePage';
import { RouteError } from './RouteError';

// Route-level code splitting keeps the first load small.
const ProductsPage = lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('@/pages/OrderSuccessPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const AccountLayout = lazy(() => import('@/pages/account/AccountLayout'));
const OrdersPage = lazy(() => import('@/pages/account/OrdersPage'));
const OrderDetailPage = lazy(() => import('@/pages/account/OrderDetailPage'));
const WishlistPage = lazy(() => import('@/pages/account/WishlistPage'));
const LibraryPage = lazy(() => import('@/pages/account/LibraryPage'));
const AddressesPage = lazy(() => import('@/pages/account/AddressesPage'));
const ProfilePage = lazy(() => import('@/pages/account/ProfilePage'));

export const router = createBrowserRouter([
  {
    element: <StoreLayout />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'product/:slug', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      {
        element: <GuestOnly />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },
      {
        element: <RequireAuth />,
        children: [
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'order-success/:id', element: <OrderSuccessPage /> },
          {
            path: 'account',
            element: <AccountLayout />,
            children: [
              { index: true, element: <Navigate to="orders" replace /> },
              { path: 'orders', element: <OrdersPage /> },
              { path: 'orders/:id', element: <OrderDetailPage /> },
              { path: 'wishlist', element: <WishlistPage /> },
              { path: 'library', element: <LibraryPage /> },
              { path: 'addresses', element: <AddressesPage /> },
              { path: 'profile', element: <ProfilePage /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
