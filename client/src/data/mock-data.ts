import type { MenuItem, Order, Restaurant, StaffMember } from '@/types';

// ─── Restaurant ─────────────────────────────────────────
export const restaurant: Restaurant = {
  id: 'the-grill-house',
  name: 'The Grill House',
  image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  rating: 4.8,
  avgPrepTime: 20,
  status: 'open',
  description:
    'Experience the finest grilled dishes in Lagos. From classic jollof rice to premium grilled meats, every plate is crafted with passion.',
};

// ─── Menu Items ─────────────────────────────────────────
export const menuItems: MenuItem[] = [
  // Food
  {
    id: 'menu-001',
    name: 'Jollof Rice',
    description:
      'Classic Nigerian jollof rice cooked with tomatoes, peppers, and aromatic spices. Served with a side of fried plantains.',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80',
    category: 'food',
    prepTime: 15,
    isPopular: true,
  },
  {
    id: 'menu-002',
    name: 'Grilled Chicken',
    description:
      'Tender grilled chicken marinated in a blend of suya spices, served with coleslaw and jollof rice.',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&q=80',
    category: 'food',
    prepTime: 20,
    isPopular: true,
  },
  {
    id: 'menu-003',
    name: 'Pepper Soup',
    description:
      'Spicy Nigerian pepper soup made with fresh catfish, uziza leaves, and traditional spices.',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
    category: 'food',
    prepTime: 25,
  },
  {
    id: 'menu-004',
    name: 'Suya Platter',
    description:
      'Grilled beef skewers seasoned with ground peanuts and spices. A Nigerian street-food classic, elevated.',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
    category: 'food',
    prepTime: 18,
    isPopular: true,
  },
  {
    id: 'menu-005',
    name: 'Egusi Soup & Pounded Yam',
    description:
      'Rich melon seed soup with assorted meats, stockfish, and spinach. Paired with smooth pounded yam.',
    price: 4500,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80',
    category: 'food',
    prepTime: 30,
  },
  {
    id: 'menu-006',
    name: 'Fried Rice & Chicken',
    description:
      'Golden fried rice tossed with mixed vegetables, served with a perfectly fried chicken drumstick.',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
    category: 'food',
    prepTime: 15,
  },
  {
    id: 'menu-007',
    name: 'Grilled Catfish',
    description:
      'Whole catfish grilled to perfection with onions, peppers, and a spicy sauce.',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
    category: 'food',
    prepTime: 25,
    isPopular: true,
  },
  {
    id: 'menu-008',
    name: 'Asun (Spicy Goat)',
    description:
      'Slow-roasted spicy goat meat, a Lagos party favourite. Tender, smoky, and irresistible.',
    price: 4000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    category: 'food',
    prepTime: 35,
  },

  // Drinks
  {
    id: 'menu-009',
    name: 'Chapman',
    description:
      'Nigeria\'s signature cocktail — a refreshing blend of Fanta, Sprite, grenadine, and Angostura bitters with cucumber.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80',
    category: 'drinks',
    prepTime: 5,
    isPopular: true,
  },
  {
    id: 'menu-010',
    name: 'Zobo Drink',
    description:
      'Chilled hibiscus tea sweetened with pineapple and ginger. A traditional Nigerian refreshment.',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
    category: 'drinks',
    prepTime: 3,
  },
  {
    id: 'menu-011',
    name: 'Fresh Fruit Smoothie',
    description:
      'A thick blend of mango, banana, and yogurt. Naturally sweet and refreshing.',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&q=80',
    category: 'drinks',
    prepTime: 5,
  },
  {
    id: 'menu-012',
    name: 'Red Wine',
    description:
      'Premium South African Cabernet Sauvignon. Full-bodied with notes of dark berry and oak.',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
    category: 'drinks',
    prepTime: 2,
  },

  // Desserts
  {
    id: 'menu-013',
    name: 'Fried Doughs',
    description:
      'Golden fried dough balls dusted with powdered sugar. Soft, fluffy, and addictive.',
    price: 800,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80',
    category: 'desserts',
    prepTime: 10,
    isPopular: true,
  },
  {
    id: 'menu-014',
    name: 'Cookies',
    description:
      'Crispy fried pastry snack with a hint of nutmeg. A beloved Nigerian treat.',
    price: 600,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80',
    category: 'desserts',
    prepTime: 5,
  },
  {
    id: 'menu-015',
    name: 'Chocolate Lava Cake',
    description:
      'Warm chocolate cake with a molten centre, served with vanilla ice cream.',
    price: 3000,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80',
    category: 'desserts',
    prepTime: 15,
  },
  {
    id: 'menu-016',
    name: 'Coconut Rice Pudding',
    description:
      'Creamy rice pudding infused with coconut milk, cinnamon, and a drizzle of honey.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
    category: 'desserts',
    prepTime: 12,
  },
];

// ─── Staff ──────────────────────────────────────────────
export const staffMembers: StaffMember[] = [
  { id: 'staff-001', name: 'David Adeyemi', role: 'waiter' },
  { id: 'staff-002', name: 'Grace Okonkwo', role: 'waiter' },
  { id: 'staff-003', name: 'Emeka Obi', role: 'chef' },
  { id: 'staff-004', name: 'Amina Bello', role: 'chef' },
  { id: 'staff-005', name: 'Daniel James', role: 'bartender' },
  { id: 'staff-006', name: 'Funke Adesanya', role: 'bartender' },
];

// ─── Sample Orders (for waiter dashboard demo) ──────────
export const sampleOrders: Order[] = [
  {
    id: 'ORD-001',
    restaurantId: 'the-grill-house',
    tableNumber: 4,
    items: [
      { menuItemId: 'menu-001', name: 'Jollof Rice', price: 2500, quantity: 2 },
      { menuItemId: 'menu-012', name: 'Red Wine', price: 5000, quantity: 1 },
    ],
    status: 'preparing',
    subtotal: 10000,
    packagingFee: 200,
    total: 10200,
    estimatedWait: 15,
    staffAssignment: {
      waiterId: 'staff-001',
      waiterName: 'David Adeyemi',
      chefId: 'staff-003',
      chefName: 'Emeka Obi',
    },
    createdAt: new Date(Date.now() - 20 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'ORD-002',
    restaurantId: 'the-grill-house',
    tableNumber: 7,
    items: [
      { menuItemId: 'menu-002', name: 'Grilled Chicken', price: 4000, quantity: 1 },
      { menuItemId: 'menu-009', name: 'Chapman', price: 1500, quantity: 2 },
      { menuItemId: 'menu-013', name: 'Puff Puff', price: 800, quantity: 1 },
    ],
    status: 'new',
    subtotal: 7800,
    packagingFee: 200,
    total: 8000,
    estimatedWait: 20,
    staffAssignment: {},
    createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    id: 'ORD-003',
    restaurantId: 'the-grill-house',
    tableNumber: 2,
    items: [
      { menuItemId: 'menu-007', name: 'Grilled Catfish', price: 5000, quantity: 1 },
      { menuItemId: 'menu-010', name: 'Zobo Drink', price: 1000, quantity: 1 },
    ],
    status: 'ready',
    subtotal: 6000,
    packagingFee: 200,
    total: 6200,
    estimatedWait: 0,
    staffAssignment: {
      waiterId: 'staff-002',
      waiterName: 'Grace Okonkwo',
      chefId: 'staff-004',
      chefName: 'Amina Bello',
      bartenderId: 'staff-005',
      bartenderName: 'Daniel James',
    },
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'ORD-004',
    restaurantId: 'the-grill-house',
    tableNumber: 12,
    items: [
      { menuItemId: 'menu-004', name: 'Suya Platter', price: 3500, quantity: 2 },
      { menuItemId: 'menu-011', name: 'Fresh Fruit Smoothie', price: 2000, quantity: 2 },
      { menuItemId: 'menu-015', name: 'Chocolate Lava Cake', price: 3000, quantity: 1 },
    ],
    status: 'preparing',
    subtotal: 14000,
    packagingFee: 200,
    total: 14200,
    estimatedWait: 12,
    staffAssignment: {
      waiterId: 'staff-001',
      waiterName: 'David Adeyemi',
      chefId: 'staff-003',
      chefName: 'Emeka Obi',
      bartenderId: 'staff-006',
      bartenderName: 'Funke Adesanya',
    },
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60000).toISOString(),
  },
  {
    id: 'ORD-005',
    restaurantId: 'the-grill-house',
    tableNumber: 9,
    items: [
      { menuItemId: 'menu-005', name: 'Egusi Soup & Pounded Yam', price: 4500, quantity: 1 },
      { menuItemId: 'menu-008', name: 'Asun (Spicy Goat)', price: 4000, quantity: 1 },
      { menuItemId: 'menu-012', name: 'Red Wine', price: 5000, quantity: 2 },
    ],
    status: 'served',
    subtotal: 18500,
    packagingFee: 200,
    total: 18700,
    estimatedWait: 0,
    staffAssignment: {
      waiterId: 'staff-002',
      waiterName: 'Grace Okonkwo',
      chefId: 'staff-004',
      chefName: 'Amina Bello',
      bartenderId: 'staff-005',
      bartenderName: 'Daniel James',
    },
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'ORD-006',
    restaurantId: 'the-grill-house',
    tableNumber: 1,
    items: [
      { menuItemId: 'menu-006', name: 'Fried Rice & Chicken', price: 3000, quantity: 3 },
      { menuItemId: 'menu-009', name: 'Chapman', price: 1500, quantity: 3 },
    ],
    status: 'assigned',
    subtotal: 13500,
    packagingFee: 200,
    total: 13700,
    estimatedWait: 18,
    staffAssignment: {
      waiterId: 'staff-001',
      waiterName: 'David Adeyemi',
    },
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60000).toISOString(),
  },
  {
    id: 'ORD-007',
    restaurantId: 'the-grill-house',
    tableNumber: 5,
    items: [
      { menuItemId: 'menu-003', name: 'Pepper Soup', price: 3000, quantity: 1 },
      { menuItemId: 'menu-014', name: 'Chin Chin', price: 600, quantity: 2 },
    ],
    status: 'paid',
    subtotal: 4200,
    packagingFee: 200,
    total: 4400,
    estimatedWait: 0,
    staffAssignment: {
      waiterId: 'staff-002',
      waiterName: 'Grace Okonkwo',
      chefId: 'staff-003',
      chefName: 'Emeka Obi',
    },
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 60000).toISOString(),
  },
];

