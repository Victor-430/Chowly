// ─── Roles ──────────────────────────────────────────────
export type Role = 'customer' | 'waiter';

// ─── Restaurant ─────────────────────────────────────────
export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  avgPrepTime: number; // minutes
  status: 'open' | 'closed';
  description: string;
}

export interface Table {
  id: string;
  number: number;
  restaurantId: string;
}

// ─── Menu ───────────────────────────────────────────────
export type MenuCategory = 'all' | 'food' | 'drinks' | 'desserts';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: MenuCategory;
  prepTime: number; // minutes
  isPopular?: boolean;
}

// ─── Cart ───────────────────────────────────────────────
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

// ─── Orders ─────────────────────────────────────────────
export type OrderStatus =
  | 'new'
  | 'assigned'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'awaiting_payment'
  | 'paid'
  | 'cancelled';

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface StaffAssignment {
  waiterId?: string;
  waiterName?: string;
  chefId?: string;
  chefName?: string;
  bartenderId?: string;
  bartenderName?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  tableNumber: number;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  packagingFee: number;
  total: number;
  estimatedWait: number; // minutes
  staffAssignment: StaffAssignment;
  createdAt: string; // ISO string
  updatedAt: string;
}

// ─── Staff ──────────────────────────────────────────────
export type StaffRole = 'waiter' | 'chef' | 'bartender';

export interface StaffMember {
  id: string;
  name: string;
  role: StaffRole;
  avatar?: string;
}

// ─── Feedback ───────────────────────────────────────────
export type ComplaintType =
  | 'food_took_too_long'
  | 'incorrect_order'
  | 'poor_service'
  | 'other';

export interface Rating {
  orderId: string;
  rating: number; // 1-5
  comment?: string;
}

export interface Complaint {
  orderId: string;
  types: ComplaintType[];
  description: string;
}

// ─── Payment ────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'completed';

export interface Payment {
  orderId: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: string;
}

