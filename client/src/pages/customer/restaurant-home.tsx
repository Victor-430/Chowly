import { useNavigate } from 'react-router';
import { useRestaurantStore } from '@/stores/restaurant-store';
import { useCartStore } from '@/stores/cart-store';
import { menuItems as fallbackMenuItems } from '@/data/mock-data';
import { menuApi } from '@/services/menu.api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HiStar, HiClock } from 'react-icons/hi2';
import { MenuCard } from '@/components/customer/menu-card';
import { MenuItemDialog } from '@/components/customer/menu-item-dialog';
import { useEffect, useState } from 'react';
import type { MenuItem } from '@/types';
import { toast } from 'sonner';

export default function RestaurantHome() {
  const navigate = useNavigate();
  const { restaurant, tableNumber, fetchRestaurant } = useRestaurantStore();
  const addItem = useCartStore((state) => state.addItem);
  
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [popularItems, setPopularItems] = useState<MenuItem[]>(() =>
    fallbackMenuItems.filter((i) => i.isPopular)
  );

  useEffect(() => {
    fetchRestaurant();
  }, [fetchRestaurant]);

  useEffect(() => {
    let isMounted = true;
    menuApi
      .list(restaurant.id)
      .then((items) => {
        if (isMounted && Array.isArray(items) && items.length > 0) {
          const popular = items.filter((i) => i.isPopular);
          setPopularItems(popular.length > 0 ? popular : items.slice(0, 6));
        }
      })
      .catch((err) => {
        console.warn('Could not fetch popular items live', err);
      });
    return () => {
      isMounted = false;
    };
  }, [restaurant.id]);

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
        <div className="absolute inset-0 bg-linear-to-t from-black/80 to-black/20" />
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

      <div className="max-w-3xl lg:max-w-5xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-surface rounded-card shadow-md p-4 flex items-center justify-between border border-border">
          <div>
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
            size="sm lg:lg"
            onClick={() => navigate('/customer/menu')}
          >
            View Menu
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-charcoal">Popular Today</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/customer/menu')}
            className="text-amber hover:text-amber/90 font-semibold"
          >
            View Full Menu →
          </Button>
        </div>

        {/* Mobile: horizontal swipe. Desktop (md+): responsive grid */}
        <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide">
          {popularItems.map((item) => (
            <div key={item.id} className="min-w-[260px] w-[260px] md:min-w-0 md:w-auto shrink-0 md:shrink flex flex-col">
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
