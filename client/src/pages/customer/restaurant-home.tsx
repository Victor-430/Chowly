import { useNavigate } from 'react-router';
import { useRestaurantStore } from '@/stores/restaurant-store';
import { useCartStore } from '@/stores/cart-store';
import { menuItems } from '@/data/mock-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HiStar, HiClock } from 'react-icons/hi2';
import { MenuCard } from '@/components/customer/menu-card';
import { MenuItemDialog } from '@/components/customer/menu-item-dialog';
import { useState } from 'react';
import type { MenuItem } from '@/types';
import { toast } from 'sonner';

export default function RestaurantHome() {
  const navigate = useNavigate();
  const { restaurant, tableNumber } = useRestaurantStore();
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  const popularItems = menuItems.filter((i) => i.isPopular);

  const handleQuickAdd = (item: MenuItem) => {
    addItem(item);
    toast.success('Added to cart');
  };

  if (!restaurant) {
    return <div className="p-8 text-center">Loading restaurant...</div>;
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div 
        className="relative h-56 sm:h-72 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${restaurant.image || '/placeholder-restaurant.jpg'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
        <div className="absolute bottom-0 left-0 p-6 w-full text-white">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-200">
                <div className="flex items-center">
                  <HiStar className="w-4 h-4 text-amber mr-1" />
                  <span>{restaurant.rating || '4.8'}</span>
                </div>
                <div className="flex items-center">
                  <HiClock className="w-4 h-4 mr-1" />
                  <span>~{restaurant.avgPrepTime} min</span>
                </div>
              </div>
            </div>
            <Badge className={restaurant.status === 'open' ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}>
              {restaurant.status === 'open' ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-[-1.5rem] relative z-10">
        <div className="bg-surface rounded-card shadow-md p-4 flex items-center justify-between border border-border">
          <div>
            {/* <p className="text-sm text-text-secondary">Dining in at</p>
            <p className="font-semibold text-lg">Table {tableNumber || '?'}</p> */}
            <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Dining in at</p>
            <div className="flex items-center gap-2.5 mt-0.5">
              <p className=" font-semibold lg:font-bold lg:text-xl text-charcoal">Table {String(tableNumber || 4).padStart(2, '0')}</p>
              <button
                type="button"
                onClick={() => navigate('/restaurant/the-grill-house/table')}
                className="text-xs font-semibold text-amber hover:underline hover:text-amber/80 transition-colors"
              >
                Change Table
              </button>
            </div>
          </div>
          <Button 
            variant="amber"
            size="lg"
            onClick={() => navigate('/customer/menu')}
          >
            View Menu
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        <h2 className="text-xl font-bold text-charcoal mb-4">Popular Today</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
          {popularItems.map((item) => (
            <div key={item.id} className="min-w-[280px] w-[280px] flex-shrink-0">
              <MenuCard 
                item={item} 
                onClick={setSelectedItem} 
                onAdd={handleQuickAdd}
              />
            </div>
          ))}
        </div>
      </div>

      <MenuItemDialog 
        item={selectedItem} 
        open={!!selectedItem} 
        onOpenChange={(open) => !open && setSelectedItem(null)} 
      />
    </div>
  );
}
