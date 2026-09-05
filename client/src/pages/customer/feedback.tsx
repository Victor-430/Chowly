import { useParams, useNavigate } from 'react-router';
import { useOrderStore } from '@/stores/order-store';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { feedbackApi } from '@/services/feedback.api';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HiStar, HiCheck } from 'react-icons/hi2';
import { toast } from 'sonner';

import type { ComplaintType } from '@/types';

const COMPLAINT_TYPES = [
  'Food took too long',
  'Incorrect order',
  'Poor service',
  'Other'
];

const TYPE_MAP: Record<string, ComplaintType> = {
  'Food took too long': 'food_took_too_long',
  'Incorrect order': 'incorrect_order',
  'Poor service': 'poor_service',
  'Other': 'other',
};

export default function Feedback() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, fetchOrder } = useOrderStore();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const order = orderId ? getOrder(orderId) : undefined;

  useEffect(() => {
    if (orderId && !order) {
      fetchOrder(orderId);
    }
  }, [orderId, order, fetchOrder]);

  if (!order) {
    return <div className="p-8 text-center">Order Not Found</div>;
  }

  const toggleComplaint = (type: string) => {
    setSelectedComplaints(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Submit rating to backend
      await feedbackApi.createRating(order.id, {
        customerId: 'cust-001',
        rating,
        comment: comment.trim() || undefined,
      }).catch((err) => console.warn('Rating API notice:', err));

      // 2. If complaints selected, submit them
      if (selectedComplaints.length > 0) {
        for (const comp of selectedComplaints) {
          await feedbackApi.createComplaint(order.id, {
            customerId: 'cust-001',
            type: TYPE_MAP[comp] || 'OTHER',
            description: comment.trim() || comp,
          }).catch((err) => console.warn('Complaint API notice:', err));
        }
      }

      toast.success('Thank you for your feedback!');
      setSubmitted(true);
      setTimeout(() => {
        navigate('/customer/orders');
      }, 2000);
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <HiCheck className="w-10 h-10 text-green-600" />
        </motion.div>
        <h2 className="text-2xl font-bold text-charcoal">Thank You!</h2>
        <p className="text-text-secondary mt-2">Your feedback helps us improve.</p>
      </div>
    );
  }

  const showComplaints = rating > 0 && rating <= 2;

  return (
    <div className="max-w-md mx-auto px-4 py-8 bg-warm-white min-h-screen">
      <h1 className="text-2xl font-bold text-charcoal text-center mb-8">How was your experience?</h1>
      
      <div className="flex justify-center space-x-2 mb-8">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none transition-transform hover:scale-110"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            <HiStar 
              className={`w-10 h-10 ${
                (hoverRating || rating) >= star ? 'text-amber' : 'text-gray-300'
              }`} 
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showComplaints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-6"
          >
            <h3 className="font-semibold text-lg mb-3">What went wrong?</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {COMPLAINT_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => toggleComplaint(type)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    selectedComplaints.includes(type)
                      ? 'bg-charcoal text-white border-charcoal'
                      : 'bg-white text-text-secondary border-border hover:bg-gray-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">
          {showComplaints ? 'Tell us more' : 'Leave a comment (optional)'}
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your thoughts..."
          rows={4}
          className="resize-none"
        />
      </div>

      <Button 
        disabled={isSubmitting}
        className="w-full bg-amber hover:bg-amber/90 text-white disabled:opacity-50" 
        size="lg"
        onClick={handleSubmit}
      >
        {isSubmitting ? 'Submitting Feedback...' : 'Submit Feedback'}
      </Button>
    </div>
  );
}
