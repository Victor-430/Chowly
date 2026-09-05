import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  color: 'default' | 'warning' | 'success' | 'info';
}

const iconStyles = {
  default: 'bg-gray-100 text-charcoal',
  warning: 'bg-amber/10 text-amber',
  success: 'bg-green-100 text-green-600',
  info: 'bg-blue-100 text-blue-600',
};

export function StatsCard({ title, count, icon, color }: StatsCardProps) {
  return (
    <Card className="bg-surface border-none shadow-sm h-full overflow-hidden">
      <CardContent className="p-3.5 sm:p-5 lg:p-6 flex flex-col justify-center h-full gap-2.5 sm:gap-4">
        <div className={cn("w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-lg sm:text-xl shrink-0", iconStyles[color])}>
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-2xl sm:text-3xl font-bold text-charcoal leading-tight">{count}</div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium truncate mt-0.5" title={title}>{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}
