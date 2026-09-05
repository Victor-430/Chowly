import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { HiMagnifyingGlass, HiClipboardDocumentList } from 'react-icons/hi2';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OrderCard } from '@/components/waiter/order-card';
import { EmptyState } from '@/components/shared/empty-state';
import { useOrderStore } from '@/stores/order-store';
import { useRestaurantStore } from '@/stores/restaurant-store';
import type { Order } from '@/types';
import { cn } from '@/lib/utils';

type FilterTab = 'All' | 'New' | 'Assigned' | 'Preparing' | 'Ready' | 'Served' | 'Paid';

export default function WaiterOrders() {
  const navigate = useNavigate();
  const { orders, fetchOrders } = useOrderStore();
  const { restaurant } = useRestaurantStore();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  useEffect(() => {
    fetchOrders({ restaurantId: restaurant.id });

    const interval = setInterval(() => {
      fetchOrders({ restaurantId: restaurant.id });
    }, 5000);

    return () => clearInterval(interval);
  }, [restaurant.id, fetchOrders]);

  const tabs: FilterTab[] = ['All', 'New', 'Assigned', 'Preparing', 'Ready', 'Served', 'Paid'];

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.tableNumber.toString().includes(search);
    
    if (!matchesSearch) return false;
    
    if (activeTab === 'All') return true;
    return o.status.toLowerCase() === activeTab.toLowerCase();
  });

  const handleOrderClick = (order: Order) => {
    navigate(`/waiter/orders/${order.id}`);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-warm-white min-h-screen">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-charcoal">All Orders</h1>
        <div className="relative w-full md:w-80">
          <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input 
            type="text" 
            placeholder="Search by Order ID or Table..." 
            className="pl-10 bg-surface border-none shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

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
          description="No orders match your search and filter criteria."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} onClick={handleOrderClick} />
          ))}
        </div>
      )}
    </div>
  );
}
