import type { CartItem as CartItemType } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { HiMinus, HiPlus, HiTrash } from 'react-icons/hi2';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (menuItemId: string, qty: number) => void;
  onRemove: (menuItemId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const { menuItem, quantity, specialInstructions } = item;

  return (
    <div className="flex items-start gap-3 p-4 border-b border-border last:border-0 bg-surface">
      <img
        src={menuItem.image}
        alt={menuItem.name}
        className="w-16 h-16 rounded-input object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="font-semibold text-charcoal">{menuItem.name}</h4>
          <span className="font-semibold text-charcoal ml-2">
            {formatCurrency(menuItem.price * quantity)}
          </span>
        </div>

        <p className="text-sm text-text-secondary mt-0.5">
          {formatCurrency(menuItem.price)} each
        </p>
        
        {specialInstructions && (
          <p className="text-sm text-text-secondary italic mt-1 line-clamp-2">
            "{specialInstructions}"
          </p>
        )}
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-2 py-1 border border-border">
            <button 
              onClick={() => onUpdateQuantity(menuItem.id, Math.max(1, quantity - 1))}
              className="p-1 text-charcoal hover:bg-gray-200 rounded-full transition-colors"
            >
              <HiMinus className="w-4 h-4" />
            </button>
            <span className="font-medium text-sm w-4 text-center">{quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(menuItem.id, quantity + 1)}
              className="p-1 text-charcoal hover:bg-gray-200 rounded-full transition-colors"
            >
              <HiPlus className="w-4 h-4" />
            </button>
          </div>
          
          <button 
            onClick={() => onRemove(menuItem.id)}
            className="text-error hover:text-error/80 p-2"
          >
            <HiTrash className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
