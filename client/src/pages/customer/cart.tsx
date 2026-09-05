import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCartStore } from '@/stores/cart-store';
import { useOrderStore } from '@/stores/order-store';
import { useRestaurantStore } from '@/stores/restaurant-store';
import { CartItem } from '@/components/customer/cart-item';
import { EmptyState } from '@/components/shared/empty-state';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { HiShoppingCart } from 'react-icons/hi2';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getSubtotal, getPackagingFee, getTotal, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();
  const { tableNumber, tableId, tables, restaurant } = useRestaurantStore();
  const [isPlacing, setIsPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    if (!tableNumber || !restaurant) {
      toast.error('Missing table or restaurant information');
      return;
    }

    setIsPlacing(true);
    try {
      const resolvedTableId = tableId || tables.find((t) => t.number === tableNumber)?.id;
      const order = await placeOrder({
        items,
        tableNumber,
        tableId: resolvedTableId,
        restaurantId: restaurant.id,
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/customer/orders/${order.id}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 min-h-[60vh] flex flex-col justify-center">
        <EmptyState
          icon={<HiShoppingCart className="w-6 h-6" />}
          title="Your cart is empty"
          description="Explore the menu and add something delicious."
          actionLabel="Browse Menu"
          onAction={() => navigate('/customer/menu')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 bg-warm-white min-h-screen pb-44">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Your Order</h1>
      
      <div className="bg-surface rounded-card border border-border shadow-sm mb-6 overflow-hidden">
        {items.map((item) => (
          <CartItem 
            key={item.menuItem.id} 
            item={item} 
            onUpdateQuantity={updateQuantity} 
            onRemove={removeItem} 
          />
        ))}
      </div>

      <div className="bg-surface rounded-card border border-border shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-3 text-text-secondary">
          <span>Subtotal</span>
          <span>{formatCurrency(getSubtotal())}</span>
        </div>
        <div className="flex justify-between items-center mb-4 text-text-secondary">
          <span>Packaging Fee</span>
          <span>{formatCurrency(getPackagingFee())}</span>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between items-center text-lg font-bold text-charcoal">
          <span>Total</span>
          <span>{formatCurrency(getTotal())}</span>
        </div>
      </div>

      {/* Floating Place Order bar positioned above the bottom mobile nav */}
      <div className="fixed bottom-16 left-0 right-0 p-3 sm:p-4 bg-surface/95 backdrop-blur-md border-t border-border z-30 shadow-lg">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div className="hidden sm:block">
            <p className="text-xs text-text-secondary">Total Due</p>
            <p className="text-lg font-bold text-charcoal">{formatCurrency(getTotal())}</p>
          </div>
          <Button 
            disabled={isPlacing}
            className="w-full sm:w-auto sm:flex-1 h-12 sm:h-14 bg-amber hover:bg-amber/90 text-white text-base sm:text-lg font-semibold rounded-full shadow-md transition-all active:scale-[0.99] disabled:opacity-50"
            onClick={handlePlaceOrder}
          >
            {isPlacing ? 'Placing Order...' : `Place Order · ${formatCurrency(getTotal())}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
