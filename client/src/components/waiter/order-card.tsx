import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { OrderStatusBadge } from '@/components/shared/order-status-badge';
import type { Order } from '@/types';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { HiTableCells, HiClock } from 'react-icons/hi2';

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card className="bg-surface border-none shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => onClick(order)}>
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            {/* <div className="font-semibold text-lg text-charcoal">{order.id}</div> */}
            <div className="text-xs text-gray-500 mt-1">{formatDateTime(order.createdAt)}</div>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiTableCells className="w-4 h-4 text-gray-400" />
            <span>Table {order.tableNumber}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-medium text-charcoal">{itemCount} items</span>
            <span>•</span>
            <span className="font-medium text-charcoal">{formatCurrency(order.total)}</span>
          </div>
          
          {order.estimatedWait !== undefined && order.estimatedWait > 0 && (
             <div className="flex items-center gap-2 text-sm text-amber">
               <HiClock className="w-4 h-4" />
               <span>{order.estimatedWait} min wait</span>
             </div>
          )}
        </div>
        
        <Button 
          variant="secondary" 
          className="w-full mt-2"
          onClick={(e) => {
            e.stopPropagation();
            onClick(order);
          }}
        >
          View Order
        </Button>
      </CardContent>
    </Card>
  );
}
