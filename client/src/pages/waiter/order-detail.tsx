import { useNavigate, useParams } from 'react-router';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { HiArrowLeft } from 'react-icons/hi2';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OrderStatusBadge } from '@/components/shared/order-status-badge';
import { EmptyState } from '@/components/shared/empty-state';
import { AssignmentPanel } from '@/components/waiter/assignment-panel';
import { useOrderStore } from '@/stores/order-store';
import { formatCurrency, formatDateTime, getNextStatus } from '@/lib/utils';
import type { OrderStatus } from '@/types';

export default function WaiterOrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, updateStatus } = useOrderStore();
  
  const order = orderId ? getOrder(orderId) : undefined;

  if (!order) {
    return (
      <div className="p-6 max-w-3xl mx-auto bg-warm-white min-h-screen flex flex-col gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="self-start gap-2">
          <HiArrowLeft className="w-5 h-5" /> Back
        </Button>
        <EmptyState 
          icon={<HiArrowLeft className="w-12 h-12" />}
          title="Order Not Found"
          description={`Order ID ${orderId} does not exist.`}
        />
      </div>
    );
  }

  const nextStatus = getNextStatus(order.status);
  const canUpdate = !['paid', 'cancelled'].includes(order.status) && nextStatus;

  const handleUpdateStatus = () => {
    if (nextStatus) {
      updateStatus(order.id, nextStatus as OrderStatus);
      toast.success(`Order marked as ${nextStatus.replace('_', ' ')}`);
    }
  };

  const statusLabels: Record<string, string> = {
    new: 'New',
    assigned: 'Assigned',
    preparing: 'Preparing',
    ready: 'Ready',
    served: 'Served',
    awaiting_payment: 'Awaiting Payment',
    paid: 'Paid',
    cancelled: 'Cancelled'
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-warm-white min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
              <HiArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-charcoal">{order.id}</h1>
              <p className="text-gray-500 text-sm">{formatDateTime(order.createdAt)}</p>
            </div>
          </div>
          <OrderStatusBadge status={order.status} />
        </header>

        <div className="bg-surface rounded-xl p-6 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Table</p>
              <p className="text-lg font-semibold text-charcoal">{order.tableNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="text-lg font-semibold text-charcoal">{'Guest'}</p>
            </div>
          </div>

          <Separator />

          <AssignmentPanel order={order} />

          <Separator />

          <div>
            <h3 className="text-lg font-semibold text-charcoal mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-charcoal">{item.quantity}x</span>
                      <span className="text-charcoal font-medium">{item.name}</span>
                    </div>
                    {item.specialInstructions && (
                      <p className="text-sm text-amber mt-1 bg-amber/10 px-2 py-1 rounded w-fit">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <span className="font-medium text-gray-700">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Packaging Fee</span>
              <span>{formatCurrency(order.packagingFee || 0)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-charcoal mt-2 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-gray-600 font-medium">
              Current Status: <span className="text-charcoal">{statusLabels[order.status] || order.status}</span>
            </p>
            {canUpdate && (
              <Button onClick={handleUpdateStatus} className="w-full mb-4 md:w-auto bg-amber hover:bg-amber/90 text-white">
                Mark as {statusLabels[nextStatus as string] || nextStatus}
              </Button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
