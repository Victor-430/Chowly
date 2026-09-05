import type { MenuItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { HiClock, HiPlus } from 'react-icons/hi2';

interface MenuCardProps {
  item: MenuItem;
  onAdd: (item: MenuItem) => void;
  onClick: (item: MenuItem) => void;
}

export function MenuCard({ item, onAdd, onClick }: MenuCardProps) {
  return (
    <div 
      onClick={() => onClick(item)}
      className="flex flex-col bg-surface rounded-card border border-border shadow-sm cursor-pointer overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-video w-full">
        <img 
          src={item.image || '/placeholder-food.jpg'} 
          alt={item.name} 
          className="w-full h-full object-cover rounded-t-card" 
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold text-lg text-charcoal">{item.name}</h3>
        <p className="text-sm text-text-secondary line-clamp-2 mt-1 flex-grow">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-col">
            <span className="font-semibold text-charcoal">
              {formatCurrency(item.price)}
            </span>
            <div className="flex items-center text-xs text-text-secondary mt-1">
              <HiClock className="mr-1 h-3 w-3" />
              {item.prepTime} min
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(item);
            }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-charcoal text-white hover:bg-gray-800 transition-colors"
          >
            <HiPlus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
