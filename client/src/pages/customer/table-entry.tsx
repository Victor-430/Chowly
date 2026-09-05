import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useRestaurantStore } from '@/stores/restaurant-store';

export default function TableEntry() {
  const { restaurantId: _restaurantId, tableId } = useParams();
  const navigate = useNavigate();
  const { setTable } = useRestaurantStore();

  useEffect(() => {
    if (tableId) {
      setTable(Number(tableId));
      
      // Add a small delay for a smooth transition feeling
      const timer = setTimeout(() => {
        navigate('/customer');
      }, 1500);
      
      return () => clearTimeout(timer);
    } else {
      navigate('/customer');
    }
  }, [tableId, navigate, setTable]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-warm-white">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-16 h-16 bg-amber rounded-full mb-6 flex items-center justify-center">
          <span className="text-white font-bold text-xl">C</span>
        </div>
        <h1 className="text-2xl font-bold text-charcoal mb-2">Welcome to Chowly</h1>
        <p className="text-text-secondary">Setting up your table...</p>
      </div>
    </div>
  );
}
