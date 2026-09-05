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
      className="h-full flex flex-col bg-surface rounded-card border border-border shadow-sm cursor-pointer overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative w-full h-44 shrink-0 overflow-hidden bg-gray-100">
        <img 
          src={item.image || '/placeholder-food.jpg'} 
          alt={item.name} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3 className="font-semibold text-base text-charcoal line-clamp-1" title={item.name}>
            {item.name}
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 mt-1 min-h-[2.5rem]">
            {item.description}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-auto">
          <div className="flex flex-col">
            <span className="font-semibold text-charcoal text-sm sm:text-base">
              {formatCurrency(item.price)}
            </span>
            <div className="flex items-center text-[11px] text-text-secondary mt-0.5">
              <HiClock className="mr-1 h-3 w-3 text-amber" />
              {item.prepTime} min
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd(item);
            }}
            aria-label={`Add ${item.name} to cart`}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-charcoal text-white hover:bg-amber hover:text-white transition-colors shadow-sm"
          >
            <HiPlus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
