import type { Order } from '@/types';
import { useOrderStore } from '@/stores/order-store';
import { StaffSelector } from './staff-selector';
import { toast } from 'sonner';

interface AssignmentPanelProps {
  order: Order;
}

export function AssignmentPanel({ order }: AssignmentPanelProps) {
  const { assignChef, assignBartender } = useOrderStore();

  const handleChefChange = (staffId: string, staffName: string) => {
    assignChef(order.id, staffId, staffName);
    toast.success(`Assigned chef: ${staffName}`);
  };

  const handleBartenderChange = (staffId: string, staffName: string) => {
    assignBartender(order.id, staffId, staffName);
    toast.success(`Assigned bartender: ${staffName}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-charcoal">Preparation Team</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <StaffSelector
            label="Chef"
            staffRole="chef"
            value={order.staffAssignment.chefId || ''}
            onChange={handleChefChange}
          />
          {order.staffAssignment.chefName && (
            <p className="text-xs text-text-secondary">
              Assigned: {order.staffAssignment.chefName}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <StaffSelector
            label="Bartender"
            staffRole="bartender"
            value={order.staffAssignment.bartenderId || ''}
            onChange={handleBartenderChange}
          />
          {order.staffAssignment.bartenderName && (
            <p className="text-xs text-text-secondary">
              Assigned: {order.staffAssignment.bartenderName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
