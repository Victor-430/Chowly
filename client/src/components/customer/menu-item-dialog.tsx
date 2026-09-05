import { useState, useEffect } from 'react';
import type { MenuItem } from '@/types';
import { useCartStore } from '@/stores/cart-store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatCurrency } from '@/lib/utils';
import { HiClock, HiMinus, HiPlus } from 'react-icons/hi2';
import { toast } from 'sonner';

interface MenuItemDialogProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MenuItemDialog({ item, open, onOpenChange }: MenuItemDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (open) {
      setQuantity(1);
      setInstructions('');
    }
  }, [open]);

  if (!item) return null;

  const handleAddToCart = () => {
    addItem(item, quantity, instructions || undefined);
    toast.success('Added to cart');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25 p-0 overflow-hidden bg-surface">
        <div className="relative w-full h-48">
          <img 
            src={item.image || '/placeholder-food.jpg'} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-charcoal">{item.name}</DialogTitle>
          </DialogHeader>
          
          <div className="mt-2 flex items-center justify-between">
            <span className="text-lg font-semibold text-amber">{formatCurrency(item.price)}</span>
            <div className="flex items-center text-sm text-text-secondary">
              <HiClock className="mr-1 h-4 w-4" />
              {item.prepTime} min
            </div>
          </div>
          
          <p className="mt-4 text-sm text-text-secondary">{item.description}</p>
          
          <div className="mt-6 flex items-center justify-between">
            <span className="font-medium text-sm">Quantity</span>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 rounded-full bg-gray-100 text-charcoal hover:bg-gray-200"
              >
                <HiMinus className="w-5 h-5" />
              </button>
              <span className="font-semibold w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 rounded-full bg-gray-100 text-charcoal hover:bg-gray-200"
              >
                <HiPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block font-medium text-sm mb-2">Special Instructions</label>
            <Textarea 
              placeholder="e.g., No onions, extra spicy..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
          
          <Button 
            className="w-full mt-6 bg-amber text-white hover:bg-amber/90" 
            size="lg"
            onClick={handleAddToCart}
          >
            Add to Order - {formatCurrency(item.price * quantity)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
