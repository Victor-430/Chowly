import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function generateOrderId(): string {
  const num = Math.floor(Math.random() * 999) + 1;
  return `ORD-${String(num).padStart(3, '0')}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Get the next valid status transition for an order */
export function getNextStatus(
  current: import('@/types').OrderStatus
): import('@/types').OrderStatus | null {
  const flow: Record<string, import('@/types').OrderStatus> = {
    new: 'assigned',
    assigned: 'preparing',
    preparing: 'ready',
    ready: 'served',
    served: 'awaiting_payment',
    awaiting_payment: 'paid',
  };
  return flow[current] ?? null;
}

/** Check whether an order can still be modified by the customer */
export function canModifyOrder(status: import('@/types').OrderStatus): boolean {
  return status === 'new' || status === 'assigned';
}

