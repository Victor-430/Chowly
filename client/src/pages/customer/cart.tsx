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
  const { tableNumber, restaurant } = useRestaurantStore();

  const handlePlaceOrder = () => {
    if (!tableNumber || !restaurant) {
      toast.error('Missing table or restaurant information');
      return;
    }

    const order = placeOrder({ items, tableNumber, restaurantId: restaurant.id });
    clearCart();
    toast.success('Order placed successfully!');
    navigate(`/customer/orders/${order.id}`);
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
    <div className="max-w-2xl mx-auto px-4 py-6 bg-warm-white min-h-screen">
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

      <div className="bg-surface rounded-card border border-border shadow-sm p-6 mb-24">
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

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface border-t border-border z-10">
        <div className="max-w-2xl mx-auto">
          <Button 
            className="w-full h-14 bg-amber hover:bg-amber/90 text-white text-lg rounded-full"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
