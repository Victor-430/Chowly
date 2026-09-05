import type { Order } from '@/types';
import { useOrderStore } from '@/stores/order-store';
import { StaffSelector } from './staff-selector';
import { HiCheck, HiExclamationCircle } from 'react-icons/hi2';
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

  const hasChef = Boolean(order.staffAssignment.chefId);
  const hasBartender = Boolean(order.staffAssignment.bartenderId);
  const hasEither = hasChef || hasBartender;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-charcoal">Preparation Team</h3>
        {!hasEither ? (
          <span className="text-xs text-amber font-medium flex items-center gap-1">
            <HiExclamationCircle className="w-3.5 h-3.5" />
            Assign chef or bartender
          </span>
        ) : (
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <HiCheck className="w-3.5 h-3.5" />
            Team assigned
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <StaffSelector
            label="Chef"
            staffRole="chef"
            value={order.staffAssignment.chefId || ''}
            onChange={handleChefChange}
          />
          {hasChef ? (
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
              <HiCheck className="w-3.5 h-3.5" />
              Assigned: {order.staffAssignment.chefName}
            </p>
          ) : (
            <p className="text-xs text-text-secondary font-normal">
              Select chef if order includes food
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
          {hasBartender ? (
            <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
              <HiCheck className="w-3.5 h-3.5" />
              Assigned: {order.staffAssignment.bartenderName}
            </p>
          ) : (
            <p className="text-xs text-text-secondary font-normal">
              Select bartender if order includes drinks
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
