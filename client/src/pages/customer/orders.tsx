import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useOrderStore } from '@/stores/order-store';
import { useRestaurantStore } from '@/stores/restaurant-store';
import { OrderStatusBadge } from '@/components/shared/order-status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { HiOutlineClock } from 'react-icons/hi2';

export default function Orders() {
  const navigate = useNavigate();
  const { tableNumber } = useRestaurantStore();
  const { getCustomerOrders, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders({ customerId: 'cust-001' });
  }, [fetchOrders]);
  
  const orders = getCustomerOrders(tableNumber || undefined);

  if (orders.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 min-h-[60vh] flex flex-col justify-center">
        <EmptyState
          icon={<HiOutlineClock className="w-6 h-6" />}
          title="No previous orders"
          description="Your completed orders will appear here."
          actionLabel="Browse Menu"
          onAction={() => navigate('/customer/menu')}
        />
      </div>
    );
  }

  // Sort by most recent first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-warm-white min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-6">Order History</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedOrders.map((order) => (
          <Card 
            key={order.id} 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/customer/orders/${order.id}`)}
          >
            <CardContent className="p-5 flex flex-col sm:flex-row justify-between sm:items-center">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  {/* <span className="font-semibold text-lg">Order #{order.id}</span> */}
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="text-sm text-text-secondary">
                  {formatDate(order.createdAt)} • {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                </div>
              </div>
              <div className="mt-4 sm:mt-0 text-right">
                <div className="font-bold text-lg text-charcoal">
                  {formatCurrency(order.total)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
