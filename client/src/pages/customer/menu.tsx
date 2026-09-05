import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { menuItems as fallbackMenuItems } from '@/data/mock-data';
import type { MenuCategory, MenuItem } from '@/types';
import { useCartStore } from '@/stores/cart-store';
import { useRestaurantStore } from '@/stores/restaurant-store';
import { menuApi } from '@/services/menu.api';
import { MenuSearch } from '@/components/customer/menu-search';
import { CategoryTabs } from '@/components/customer/category-tabs';
import { MenuCard } from '@/components/customer/menu-card';
import { MenuItemDialog } from '@/components/customer/menu-item-dialog';
import { EmptyState } from '@/components/shared/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { HiShoppingCart } from 'react-icons/hi2';
import { toast } from 'sonner';

const CATEGORIES: { value: MenuCategory; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'food', label: 'Food' },
  { value: 'drinks', label: 'Drinks' },
  { value: 'desserts', label: 'Desserts' },
];

export default function Menu() {
  const navigate = useNavigate();
  const { restaurant } = useRestaurantStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<MenuCategory>('all');
  const [items, setItems] = useState<MenuItem[]>(fallbackMenuItems);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  
  const { addItem, getItemCount, getTotal } = useCartStore();

  useEffect(() => {
    let isMounted = true;
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const data = await menuApi.list(restaurant.id, category === 'all' ? undefined : category);
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else if (isMounted) {
          const fallback = fallbackMenuItems.filter((i) =>
            category === 'all' ? true : i.category.toLowerCase() === category.toLowerCase()
          );
          setItems(fallback);
        }
      } catch (err) {
        console.warn('Could not load live menu, using cached items:', err);
        const fallback = fallbackMenuItems.filter((i) =>
          category === 'all' ? true : i.category.toLowerCase() === category.toLowerCase()
        );
        if (isMounted) setItems(fallback);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchMenu();
    return () => {
      isMounted = false;
    };
  }, [restaurant.id, category]);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || item.category.toLowerCase() === category.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleQuickAdd = (item: MenuItem) => {
    addItem(item);
    toast.success('Added to cart');
  };

  const cartCount = getItemCount();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-28 min-h-screen bg-warm-white">
      <div className="sticky top-0 z-20 bg-warm-white pb-4 pt-2">
        <MenuSearch value={search} onChange={setSearch} />
        <div className="mt-4">
          <CategoryTabs categories={CATEGORIES} active={category} onChange={setCategory} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-card border border-border p-4 flex flex-col gap-3">
              <Skeleton className="w-full h-40 rounded-card" />
              <Skeleton className="w-3/4 h-5" />
              <Skeleton className="w-full h-4" />
              <div className="flex justify-between items-center mt-2">
                <Skeleton className="w-16 h-6" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filteredItems.map((item) => (
            <MenuCard 
              key={item.id} 
              item={item} 
              onClick={setSelectedItem} 
              onAdd={handleQuickAdd} 
            />
          ))}
        </div>
      ) : (
        <div className="mt-12">
          <EmptyState 
            icon={<HiShoppingCart className="w-6 h-6" />}
            title="No menu items found" 
            description="Try adjusting your search or switching categories." 
          />
        </div>
      )}

      <MenuItemDialog 
        item={selectedItem} 
        open={!!selectedItem} 
        onOpenChange={(open) => !open && setSelectedItem(null)} 
      />

      {cartCount > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 z-30 pointer-events-none">
          <div className="max-w-md mx-auto pointer-events-auto">
            <Button 
              className="w-full h-14 bg-amber hover:bg-amber/90 text-white rounded-full shadow-lg flex items-center justify-between px-6 transition-all active:scale-[0.99]"
              onClick={() => navigate('/customer/cart')}
            >
              <div className="flex items-center">
                <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center font-bold mr-3">
                  {cartCount}
                </div>
                <span className="font-semibold text-lg">View Cart</span>
              </div>
              <span className="font-semibold text-lg">{formatCurrency(getTotal())}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
