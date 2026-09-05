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
    <Card className="bg-surface border-none shadow-sm h-full">
      <CardContent className="p-6 flex flex-col justify-center h-full gap-4">
        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-xl", iconStyles[color])}>
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold text-charcoal">{count}</div>
          <div className="text-sm text-gray-500 font-medium">{title}</div>
        </div>
      </CardContent>
    </Card>
  );
}
