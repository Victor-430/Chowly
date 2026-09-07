import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useOrderStore } from '@/stores/order-store';
import { motion } from 'framer-motion';
import { HiCheck, HiArrowLeft, HiStar, HiExclamationCircle } from 'react-icons/hi2';
import { OrderTimeline } from '@/components/customer/order-timeline';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, fetchOrder } = useOrderStore();
  const [loading, setLoading] = useState(true);
  
  const order = orderId ? getOrder(orderId) : undefined;

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    fetchOrder(orderId).finally(() => {
      if (isMounted) setLoading(false);
    });

    // Poll for status updates every 5 seconds if order is active
    const interval = setInterval(() => {
      const current = orderId ? getOrder(orderId) : undefined;
      if (current && ['paid', 'cancelled'].includes(current.status)) {
        return;
      }
      if (orderId) {
        fetchOrder(orderId);
      }
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderId, fetchOrder, getOrder]);

  if (loading && !order) {
    return (
      <div className="p-12 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-amber border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-text-secondary">Loading your order details...</p>
      </div>
    );
  }

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
  const hasRating = Boolean(order.rating);
  const hasComplaints = Boolean(order.complaints && order.complaints.length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-warm-white min-h-screen">
      <div className="flex flex-col items-center mb-8">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4"
        >
          <HiCheck className="w-8 h-8 text-green-600" />
        </motion.div>
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">Order Confirmed!</h1>
        <p className="text-text-secondary mt-1">Table {order.tableNumber}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mb-8">
        <Card className="border-border shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-lg mb-4">Order Status</h3>
            <OrderTimeline status={order.status} staffAssignment={order.staffAssignment} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border shadow-sm">
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

          {(hasRating || hasComplaints) && (
            <Card className="border-border shadow-sm bg-surface">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-charcoal">Your Feedback</h3>
                  {hasRating && (
                    <div className="flex items-center gap-1 bg-amber/10 text-amber px-2.5 py-1 rounded-full text-sm font-semibold">
                      <HiStar className="w-4 h-4 fill-amber" />
                      <span>{order.rating?.rating} / 5</span>
                    </div>
                  )}
                </div>

                {hasRating && (
                  <div className="flex gap-1 py-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <HiStar
                        key={star}
                        className={`w-5 h-5 ${
                          (order.rating?.rating || 0) >= star ? 'text-amber fill-amber' : 'text-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {order.rating?.comment && (
                  <p className="text-sm text-gray-700 bg-gray-50 border border-gray-100 rounded-lg p-3 italic">
                    "{order.rating.comment}"
                  </p>
                )}

                {hasComplaints && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                      Issues Reported
                    </p>
                    <div className="space-y-2">
                      {order.complaints?.map((comp, idx) => (
                        <div
                          key={comp.id || idx}
                          className="flex items-start gap-2 text-xs bg-red-50 text-red-700 border border-red-200/60 rounded-md p-2"
                        >
                          <HiExclamationCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                          <div>
                            <span className="font-semibold capitalize">
                              {typeof comp.type === 'string' ? comp.type.replace(/_/g, ' ') : comp.type}
                            </span>
                            {comp.description && comp.description !== comp.type && (
                              <p className="text-red-600 mt-0.5">{comp.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {isPaid ? (
              hasRating ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    className="w-full"
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/customer/orders')}
                  >
                    View All Orders
                  </Button>
                  <Button
                    className="w-full"
                    variant="secondary"
                    size="lg"
                    onClick={() => navigate('/customer/menu')}
                  >
                    <HiArrowLeft className="mr-2 h-4 w-4" />
                    Back to Menu
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full bg-amber hover:bg-amber/90 text-white" 
                  size="lg"
                  onClick={() => navigate(`/customer/feedback/${order.id}`)}
                >
                  Rate Experience
                </Button>
              )
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
      </div>
    </div>
  );
}
