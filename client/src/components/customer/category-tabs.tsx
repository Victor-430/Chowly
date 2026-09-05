import { cn } from '@/lib/utils';
import type { MenuCategory } from '@/types';

interface CategoryTabsProps {
  categories: { value: MenuCategory | 'all'; label: string }[];
  active: MenuCategory | 'all';
  onChange: (cat: MenuCategory | 'all') => void;
}

export function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  return (
    <div className="flex w-full overflow-x-auto scrollbar-hide gap-3 py-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={cn(
            "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors",
            active === cat.value
              ? "bg-charcoal text-white"
              : "bg-surface border text-text-secondary hover:bg-gray-50"
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
