import type { OrderStatus, StaffAssignment } from '@/types';
import { cn } from '@/lib/utils';
import { HiCheck } from 'react-icons/hi2';

interface OrderTimelineProps {
  status: OrderStatus;
  staffAssignment: StaffAssignment;
}

const STEPS = [
  { id: 'new', label: 'Order Received', mapTo: ['new'] },
  { id: 'assigned_waiter', label: 'Waiter Assigned', mapTo: ['assigned', 'preparing', 'ready', 'served'] },
  { id: 'assigned_chef', label: 'Kitchen / Bar Assigned', mapTo: ['preparing', 'ready', 'served'] },
  { id: 'preparing', label: 'Preparing', mapTo: ['preparing', 'ready', 'served'] },
  { id: 'ready', label: 'Ready', mapTo: ['ready', 'served'] },
  { id: 'served', label: 'Served', mapTo: ['served', 'paid'] },
];

export function OrderTimeline({ status, staffAssignment }: OrderTimelineProps) {
  
  const getStepState = (stepId: string, mapTo: string[]) => {
    if (status === 'cancelled') return 'cancelled';
    
    const isCompleted = mapTo.includes(status) && status !== stepId;
    const isActive = status === stepId;
    
    // Special handling for sub-states that rely on staffAssignment
    if (stepId === 'assigned_waiter') {
      if (staffAssignment.waiterId) return isActive ? 'active' : 'completed';
      return 'pending';
    }
    
    if (stepId === 'assigned_chef') {
      if (staffAssignment.chefId || staffAssignment.bartenderId) return isActive ? 'active' : 'completed';
      return 'pending';
    }
    
    if (status === 'ready' && stepId === 'preparing') return 'completed';
    if (status === 'served' && (stepId === 'ready' || stepId === 'preparing')) return 'completed';
    if (status === 'paid') return 'completed';
    
    if (isActive) return 'active';
    if (isCompleted) return 'completed';
    
    return 'pending';
  };

  return (
    <div className="flex flex-col space-y-6">
      {STEPS.map((step, index) => {
        const state = getStepState(step.id, step.mapTo);
        const isLast = index === STEPS.length - 1;
        
        let staffName = null;
        if (step.id === 'assigned_waiter' && staffAssignment.waiterId) staffName = "Waiter Assigned";
        if (step.id === 'assigned_chef') {
          if (staffAssignment.chefName && staffAssignment.bartenderName) {
            staffName = `${staffAssignment.chefName} (Chef) & ${staffAssignment.bartenderName} (Bartender)`;
          } else if (staffAssignment.chefName) {
            staffName = `${staffAssignment.chefName} (Chef)`;
          } else if (staffAssignment.bartenderName) {
            staffName = `${staffAssignment.bartenderName} (Bartender)`;
          }
        }
        
        return (
          <div key={step.id} className="relative flex items-start">
            {!isLast && (
              <div 
                className={cn(
                  "absolute left-[11px] top-6 bottom-[-24px] w-0.5",
                  state === 'completed' ? "bg-green-500" : "bg-gray-200"
                )}
              />
            )}
            
            <div className="relative flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-full bg-surface z-10">
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
              <span className={cn(
                "text-sm font-medium",
                state === 'completed' ? "text-charcoal" : state === 'active' ? "text-amber font-bold" : "text-gray-400"
              )}>
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
