import { useParams, useNavigate } from 'react-router';
import { useOrderStore } from '@/stores/order-store';
import { motion } from 'framer-motion';
import { HiCheck, HiArrowLeft } from 'react-icons/hi2';
import { OrderTimeline } from '@/components/customer/order-timeline';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const getOrder = useOrderStore((state) => state.getOrder);
  
  const order = orderId ? getOrder(orderId) : undefined;

  if (!order) {
    return (
      <div className="p-8 text-center flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4">Order Not Found</h2>
        <Button onClick={() => navigate('/customer/menu')} variant="secondary">
          Back to Menu
        </Button>
      </div>
    );
  }

  const isServed = order.status === 'served' || order.status === 'awaiting_payment';
  const isPaid = order.status === 'paid';

  return (
    <div className="max-w-xl mx-auto px-4 py-8 bg-warm-white min-h-screen">
      <div className="flex flex-col items-center mb-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
        >
          <HiCheck className="w-8 h-8 text-green-600" />
        </motion.div>
        <h1 className="text-2xl font-bold text-charcoal">Order Confirmed!</h1>
        <p className="text-text-secondary mt-1">Table {order.tableNumber}</p>
        <p className="text-sm font-medium text-gray-500">#{order.id}</p>
      </div>

      <Card className="mb-6 border-border shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-4">Order Status</h3>
          <OrderTimeline status={order.status} staffAssignment={order.staffAssignment} />
        </CardContent>
      </Card>

      <Card className="mb-8 border-border shadow-sm">
        <CardContent className="p-5">
          <h3 className="font-semibold text-lg mb-3">Order Details</h3>
          <div className="space-y-3 mb-4">
            {order.items.map((item) => (
              <div key={item.menuItemId} className="flex justify-between text-sm">
                <span>{item.quantity} × {item.name}</span>
                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-lg text-charcoal">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {isPaid ? (
          <Button 
            className="w-full bg-amber hover:bg-amber/90 text-white" 
            size="lg"
            onClick={() => navigate(`/customer/feedback/${order.id}`)}
          >
            Rate Experience
          </Button>
        ) : isServed ? (
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 text-white" 
            size="lg"
            onClick={() => navigate(`/customer/payment/${order.id}`)}
          >
            Pay Bill
          </Button>
        ) : (
          <Button 
            className="w-full" 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/customer/menu')}
          >
            <HiArrowLeft className="mr-2 h-4 w-4" />
            Back to Menu
          </Button>
        )}
      </div>
    </div>
  );
}
