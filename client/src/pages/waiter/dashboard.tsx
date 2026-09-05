import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { HiClipboardDocumentList, HiFire, HiCheckCircle, HiCheck } from 'react-icons/hi2';
import { StatsCard } from '@/components/waiter/stats-card';
import { OrderCard } from '@/components/waiter/order-card';
import { EmptyState } from '@/components/shared/empty-state';
import { useOrderStore } from '@/stores/order-store';
import { useRestaurantStore } from '@/stores/restaurant-store';
import { getGreeting } from '@/lib/utils';
import type { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterTab = 'All' | 'New' | 'Preparing' | 'Ready';

export default function WaiterDashboard() {
  const navigate = useNavigate();
  const { getActiveOrders, orders, fetchOrders } = useOrderStore();
  const { restaurant } = useRestaurantStore();
  const activeOrders = getActiveOrders();
  
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  useEffect(() => {
    fetchOrders({ restaurantId: restaurant.id });

    const interval = setInterval(() => {
      fetchOrders({ restaurantId: restaurant.id });
    }, 5000);

    return () => clearInterval(interval);
  }, [restaurant.id, fetchOrders]);

  const preparingCount = activeOrders.filter(o => o.status === 'preparing').length;
  const readyCount = activeOrders.filter(o => o.status === 'ready').length;
  const servedTodayCount = orders.filter(o => o.status === 'served' || o.status === 'awaiting_payment' || o.status === 'paid').length;

  const filteredOrders = activeOrders.filter(o => {
    if (activeTab === 'All') return true;
    if (activeTab === 'New') return o.status === 'new' || o.status === 'assigned';
    if (activeTab === 'Preparing') return o.status === 'preparing';
    if (activeTab === 'Ready') return o.status === 'ready';
    return true;
  });

  const handleOrderClick = (order: Order) => {
    navigate(`/waiter/orders/${order.id}`);
  };

  const tabs: FilterTab[] = ['All', 'New', 'Preparing', 'Ready'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-warm-white min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-charcoal">{getGreeting()}, David</h1>
        <p className="text-gray-500 mt-1">Today's Overview</p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Active Orders" 
          count={activeOrders.length} 
          icon={<HiClipboardDocumentList className="w-6 h-6" />} 
          color="info" 
        />
        <StatsCard 
          title="Preparing" 
          count={preparingCount} 
          icon={<HiFire className="w-6 h-6" />} 
          color="warning" 
        />
        <StatsCard 
          title="Ready" 
          count={readyCount} 
          icon={<HiCheckCircle className="w-6 h-6" />} 
          color="success" 
        />
        <StatsCard 
          title="Served Today" 
          count={servedTodayCount} 
          icon={<HiCheck className="w-6 h-6" />} 
          color="default" 
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-charcoal">Active Orders</h2>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'secondary'}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-full whitespace-nowrap",
                activeTab === tab ? "bg-charcoal text-white" : "bg-surface text-gray-600 hover:text-charcoal"
              )}
            >
              {tab}
            </Button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState 
            icon={<HiClipboardDocumentList className="w-12 h-12" />}
            title="No orders found" 
            description="There are currently no active orders matching this filter."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOrders.map(order => (
              <OrderCard key={order.id} order={order} onClick={handleOrderClick} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
