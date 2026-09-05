import { useParams, useNavigate } from 'react-router';
import { useOrderStore } from '@/stores/order-store';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import { feedbackApi } from '@/services/feedback.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HiInformationCircle, HiCheck } from 'react-icons/hi2';
import { toast } from 'sonner';

export default function Payment() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, fetchOrder, updateStatus } = useOrderStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const order = orderId ? getOrder(orderId) : undefined;

  useEffect(() => {
    if (orderId && !order) {
      fetchOrder(orderId);
    }
  }, [orderId, order, fetchOrder]);

  if (!order) {
    return <div className="p-8 text-center">Order Not Found</div>;
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      await feedbackApi.createPayment(order.id, 'CARD');
      await updateStatus(order.id, 'paid');
      toast.success('Payment processed successfully');
      setIsSuccess(true);
    } catch (err: any) {
      console.warn('API payment failed or offline, updating locally:', err);
      await updateStatus(order.id, 'paid');
      toast.success('Payment processed successfully');
      setIsSuccess(true);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <HiCheck className="w-10 h-10 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Payment Successful!</h2>
        <p className="text-text-secondary mb-6">Order #{order.id} • {formatCurrency(order.total)}</p>
        
        <Button 
          className="w-full bg-amber hover:bg-amber/90 text-white" 
          size="lg"
          onClick={() => navigate(`/customer/feedback/${order.id}`)}
        >
          Rate Your Experience
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 bg-warm-white min-h-screen">
      <h1 className="text-2xl font-bold text-charcoal mb-6">Your Bill</h1>
      
      <Card className="mb-6 shadow-sm border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-3 text-sm">
            <span className="text-text-secondary">Subtotal</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between items-center mb-4 text-sm">
            <span className="text-text-secondary">Packaging Fee</span>
            <span>{formatCurrency(order.packagingFee)}</span>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center font-bold text-xl text-charcoal">
            <span>Total</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </CardContent>
      </Card>

      <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex items-start mb-8 border border-blue-200">
        <HiInformationCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
        <p className="text-sm">Demo Payment — No real payment will be processed. Feel free to proceed.</p>
      </div>

      <Button 
        disabled={isProcessing}
        className="w-full bg-amber hover:bg-amber/90 text-white disabled:opacity-50" 
        size="lg"
        onClick={handlePayment}
      >
        {isProcessing ? 'Processing Payment...' : `Pay ${formatCurrency(order.total)}`}
      </Button>
    </div>
  );
}
