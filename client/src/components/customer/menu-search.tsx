import { Input } from '@/components/ui/input';
import { HiMagnifyingGlass } from 'react-icons/hi2';

interface MenuSearchProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function MenuSearch({ value, onChange, placeholder = "Search menu..." }: MenuSearchProps) {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <HiMagnifyingGlass className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-surface w-full rounded-full"
        placeholder={placeholder}
      />
    </div>
  );
}
