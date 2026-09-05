import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router';
import { useRoleStore } from '@/stores/role-store';
import { Skeleton } from '@/components/ui/skeleton';

// Layouts
import CustomerShell from '@/layouts/customer-shell';
import WaiterShell from '@/layouts/waiter-shell';

// Customer pages
const RestaurantHome = lazy(() => import('@/pages/customer/restaurant-home'));
const Menu = lazy(() => import('@/pages/customer/menu'));
const Cart = lazy(() => import('@/pages/customer/cart'));
const OrderConfirmation = lazy(() => import('@/pages/customer/order-confirmation'));
const CustomerOrders = lazy(() => import('@/pages/customer/orders'));
const Payment = lazy(() => import('@/pages/customer/payment'));
const Feedback = lazy(() => import('@/pages/customer/feedback'));
const TableEntry = lazy(() => import('@/pages/customer/table-entry'));

// Waiter pages
const Dashboard = lazy(() => import('@/pages/waiter/dashboard'));
const WaiterOrders = lazy(() => import('@/pages/waiter/orders'));
const WaiterOrderDetail = lazy(() => import('@/pages/waiter/order-detail'));

function PageLoader() {
  return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-48 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    </div>
  );
}

function RoleRedirect() {
  const { role } = useRoleStore();
  const navigate = useNavigate();

  useEffect(() => {
    navigate(role === 'waiter' ? '/waiter' : '/customer', { replace: true });
  }, [role, navigate]);

  return <PageLoader />;
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Root redirect based on role ────────── */}
          <Route path="/" element={<RoleRedirect />} />

          {/* ── QR / Restaurant & Table entry ──────── */}
          <Route path="/restaurant" element={<TableEntry />} />
          <Route path="/restaurant/:restaurantId" element={<TableEntry />} />
          <Route path="/restaurant/:restaurantId/table" element={<TableEntry />} />
          <Route
            path="/restaurant/:restaurantId/table/:tableId"
            element={<TableEntry />}
          />
          <Route path="/select-table" element={<TableEntry />} />
          <Route path="/tables" element={<TableEntry />} />

          {/* ── Customer Routes ────────────────────── */}
          <Route path="/customer" element={<CustomerShell />}>
            <Route index element={<RestaurantHome />} />
            <Route path="menu" element={<Menu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="orders/:orderId" element={<OrderConfirmation />} />
            <Route path="payment/:orderId" element={<Payment />} />
            <Route path="feedback/:orderId" element={<Feedback />} />
          </Route>

          {/* ── Waiter Routes ──────────────────────── */}
          <Route path="/waiter" element={<WaiterShell />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<WaiterOrders />} />
            <Route path="orders/:orderId" element={<WaiterOrderDetail />} />
          </Route>

          {/* ── Fallback ───────────────────────────── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
