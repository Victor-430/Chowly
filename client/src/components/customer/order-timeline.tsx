import type { OrderStatus, StaffAssignment } from '@/types';
import { cn } from '@/lib/utils';
import { HiCheck } from 'react-icons/hi2';

interface OrderTimelineProps {
  status: OrderStatus;
  staffAssignment: StaffAssignment;
}

const STEPS = [
  { id: 'new', label: 'Order Received' },
  { id: 'assigned_waiter', label: 'Waiter Assigned' },
  { id: 'assigned_chef', label: 'Kitchen / Bar Assigned' },
  { id: 'preparing', label: 'Preparing' },
  { id: 'ready', label: 'Ready' },
  { id: 'served', label: 'Served' },
];

export function OrderTimeline({ status, staffAssignment }: OrderTimelineProps) {
  const getStepState = (stepId: string): 'completed' | 'active' | 'pending' | 'cancelled' => {
    if (status === 'cancelled') return 'cancelled';

    switch (stepId) {
      case 'new':
        // If the order is created, it has been received.
        // It remains 'active' while new, and is 'completed' (green check) once progressed.
        return status === 'new' ? 'active' : 'completed';

      case 'assigned_waiter':
        if (status === 'new') return 'pending';
        if (status === 'assigned') {
          return staffAssignment?.waiterId ? 'completed' : 'active';
        }
        return 'completed';

      case 'assigned_chef':
        if (status === 'new') return 'pending';
        if (status === 'assigned') {
          const hasStaff = Boolean(staffAssignment?.chefId || staffAssignment?.bartenderId);
          return hasStaff ? 'completed' : 'active';
        }
        return 'completed';

      case 'preparing':
        if (status === 'new' || status === 'assigned') return 'pending';
        if (status === 'preparing') return 'active';
        return 'completed';

      case 'ready':
        if (['new', 'assigned', 'preparing'].includes(status)) return 'pending';
        if (status === 'ready') return 'active';
        return 'completed';

      case 'served':
        if (status === 'paid') return 'completed';
        if (status === 'served' || status === 'awaiting_payment') return 'active';
        return 'pending';

      default:
        return 'pending';
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      {STEPS.map((step, index) => {
        const state = getStepState(step.id);
        const isLast = index === STEPS.length - 1;

        let staffName: string | null = null;
        if (step.id === 'assigned_waiter' && staffAssignment?.waiterId) {
          staffName = staffAssignment.waiterName ? `Waiter: ${staffAssignment.waiterName}` : 'Waiter Assigned';
        }
        if (step.id === 'assigned_chef') {
          if (staffAssignment?.chefName && staffAssignment?.bartenderName) {
            staffName = `${staffAssignment.chefName} (Chef) & ${staffAssignment.bartenderName} (Bartender)`;
          } else if (staffAssignment?.chefName) {
            staffName = `Chef: ${staffAssignment.chefName}`;
          } else if (staffAssignment?.bartenderName) {
            staffName = `Bartender: ${staffAssignment.bartenderName}`;
          }
        }

        return (
          <div key={step.id} className="relative flex items-start">
            {!isLast && (
              <div
                className={cn(
                  'absolute left-2.75 top-6 bottom-6 w-0.5',
                  state === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                )}
              />
            )}

            <div className="relative flex items-center justify-center shrink-0 w-6 h-6 rounded-full bg-surface z-10">
              {state === 'completed' ? (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <HiCheck className="w-4 h-4 text-white" />
                </div>
              ) : state === 'active' ? (
                <div className="w-6 h-6 rounded-full border-2 border-amber flex items-center justify-center bg-white">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber animate-pulse" />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-200 bg-white" />
              )}
            </div>

            <div className="ml-4 flex flex-col">
              <span
                className={cn(
                  'text-sm font-medium',
                  state === 'completed'
                    ? 'text-charcoal'
                    : state === 'active'
                    ? 'text-amber font-bold'
                    : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
              {staffName && (
                <span className="text-xs text-text-secondary mt-0.5">{staffName}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
