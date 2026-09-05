import { PrismaClient, StaffRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Chowly database...');

  // 1. Restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { id: 'the-grill-house' },
    create: {
      id: 'the-grill-house',
      name: 'The Grill House',
      phone: '+234 801 234 5678',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      description: 'Experience the finest grilled dishes in Lagos. From classic jollof rice to premium grilled meats, every plate is crafted with passion.',
      openingTime: '10:00 AM',
      closingTime: '11:00 PM',
      status: 'OPEN',
      averagePrepTime: 20,
      commissionRate: 5.0,
    },
    update: {
      name: 'The Grill House',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      description: 'Experience the finest grilled dishes in Lagos. From classic jollof rice to premium grilled meats, every plate is crafted with passion.',
      averagePrepTime: 20,
      status: 'OPEN',
    },
  });
  console.log(`Restaurant seeded: ${restaurant.name} (${restaurant.id})`);

  // 2. Menu Categories
  const categories = ['food', 'drinks', 'desserts'];
  const categoryMap = new Map<string, string>();

  for (const catName of categories) {
    const cat = await prisma.menuCategory.upsert({
      where: { name: catName },
      create: { name: catName },
      update: {},
    });
    categoryMap.set(catName, cat.id);
  }
  console.log(`Menu categories seeded: ${categories.join(', ')}`);

  // 3. Tables (1-15)
  for (let tableNum = 1; tableNum <= 15; tableNum++) {
    await prisma.restaurantTable.upsert({
      where: {
        restaurantId_tableNumber: {
          restaurantId: restaurant.id,
          tableNumber: tableNum,
        },
      },
      create: {
        restaurantId: restaurant.id,
        tableNumber: tableNum,
        capacity: 4,
        status: 'AVAILABLE',
      },
      update: {
        capacity: 4,
      },
    });
  }
  console.log('Tables 1-15 seeded');

  // 4. Staff Members
  const staffData: Array<{ id: string; fullName: string; role: StaffRole }> = [
    { id: 'staff-001', fullName: 'David Adeyemi', role: 'WAITER' },
    { id: 'staff-002', fullName: 'Grace Okonkwo', role: 'WAITER' },
    { id: 'staff-003', fullName: 'Emeka Obi', role: 'CHEF' },
    { id: 'staff-004', fullName: 'Amina Bello', role: 'CHEF' },
    { id: 'staff-005', fullName: 'Daniel James', role: 'BARTENDER' },
    { id: 'staff-006', fullName: 'Funke Adesanya', role: 'BARTENDER' },
  ];

  for (const staff of staffData) {
    await prisma.staff.upsert({
      where: { id: staff.id },
      create: {
        id: staff.id,
        restaurantId: restaurant.id,
        fullName: staff.fullName,
        role: staff.role,
        availability: 'AVAILABLE',
      },
      update: {
        fullName: staff.fullName,
        role: staff.role,
      },
    });
  }
  console.log(`Staff members seeded: ${staffData.length}`);

  // 5. Menu Items
  const menuItemsData = [
    // Food
    {
      id: 'menu-001',
      name: 'Jollof Rice',
      description: 'Classic Nigerian jollof rice cooked with tomatoes, peppers, and aromatic spices. Served with a side of fried plantains.',
      price: 2500,
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80',
      category: 'food',
      prepTime: 15,
    },
    {
      id: 'menu-002',
      name: 'Grilled Chicken',
      description: 'Tender grilled chicken marinated in a blend of suya spices, served with coleslaw and jollof rice.',
      price: 4000,
      image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=400&q=80',
      category: 'food',
      prepTime: 20,
    },
    {
      id: 'menu-003',
      name: 'Pepper Soup',
      description: 'Spicy Nigerian pepper soup made with fresh catfish, uziza leaves, and traditional spices.',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=80',
      category: 'food',
      prepTime: 25,
    },
    {
      id: 'menu-004',
      name: 'Suya Platter',
      description: 'Grilled beef skewers seasoned with ground peanuts and spices. A Nigerian street-food classic, elevated.',
      price: 3500,
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
      category: 'food',
      prepTime: 18,
    },
    {
      id: 'menu-005',
      name: 'Egusi Soup & Pounded Yam',
      description: 'Rich melon seed soup with assorted meats, stockfish, and spinach. Paired with smooth pounded yam.',
      price: 4500,
      image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80',
      category: 'food',
      prepTime: 30,
    },
    {
      id: 'menu-006',
      name: 'Fried Rice & Chicken',
      description: 'Golden fried rice tossed with mixed vegetables, served with a perfectly fried chicken drumstick.',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
      category: 'food',
      prepTime: 15,
    },
    {
      id: 'menu-007',
      name: 'Grilled Catfish',
      description: 'Whole catfish grilled to perfection with onions, peppers, and a spicy sauce.',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80',
      category: 'food',
      prepTime: 25,
    },
    {
      id: 'menu-008',
      name: 'Asun (Spicy Goat)',
      description: 'Slow-roasted spicy goat meat, a Lagos party favourite. Tender, smoky, and irresistible.',
      price: 4000,
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
      category: 'food',
      prepTime: 35,
    },

    // Drinks
    {
      id: 'menu-009',
      name: 'Chapman',
      description: "Nigeria's signature cocktail — a refreshing blend of Fanta, Sprite, grenadine, and Angostura bitters with cucumber.",
      price: 1500,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&q=80',
      category: 'drinks',
      prepTime: 5,
    },
    {
      id: 'menu-010',
      name: 'Zobo Drink',
      description: 'Chilled hibiscus tea sweetened with pineapple and ginger. A traditional Nigerian refreshment.',
      price: 1000,
      image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=80',
      category: 'drinks',
      prepTime: 3,
    },
    {
      id: 'menu-011',
      name: 'Fresh Fruit Smoothie',
      description: 'A thick blend of mango, banana, and yogurt. Naturally sweet and refreshing.',
      price: 2000,
      image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&q=80',
      category: 'drinks',
      prepTime: 5,
    },
    {
      id: 'menu-012',
      name: 'Red Wine',
      description: 'Premium South African Cabernet Sauvignon. Full-bodied with notes of dark berry and oak.',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80',
      category: 'drinks',
      prepTime: 2,
    },

    // Desserts
    {
      id: 'menu-013',
      name: 'Fried Doughs',
      description: 'Golden fried dough balls dusted with powdered sugar. Soft, fluffy, and addictive.',
      price: 800,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80',
      category: 'desserts',
      prepTime: 10,
    },
    {
      id: 'menu-014',
      name: 'Cookies',
      description: 'Crispy fried pastry snack with a hint of nutmeg. A beloved Nigerian treat.',
      price: 600,
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80',
      category: 'desserts',
      prepTime: 5,
    },
    {
      id: 'menu-015',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a molten centre, served with vanilla ice cream.',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80',
      category: 'desserts',
      prepTime: 15,
    },
    {
      id: 'menu-016',
      name: 'Coconut Rice Pudding',
      description: 'Creamy rice pudding infused with coconut milk, cinnamon, and a drizzle of honey.',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80',
      category: 'desserts',
      prepTime: 12,
    },
  ];

  for (const item of menuItemsData) {
    const categoryId = categoryMap.get(item.category)!;
    await prisma.menuItem.upsert({
      where: { id: item.id },
      create: {
        id: item.id,
        restaurantId: restaurant.id,
        categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        preparationTime: item.prepTime,
        image: item.image,
        availabilityStatus: true,
      },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        preparationTime: item.prepTime,
        image: item.image,
        categoryId,
        availabilityStatus: true,
      },
    });
  }
  console.log(`Menu items seeded: ${menuItemsData.length}`);

  // 6. Test Customers
  const customer1 = await prisma.customer.upsert({
    where: { id: 'cust-001' },
    create: { id: 'cust-001', displayName: 'Dine-in Customer 1' },
    update: { displayName: 'Dine-in Customer 1' },
  });
  const customer2 = await prisma.customer.upsert({
    where: { id: 'cust-002' },
    create: { id: 'cust-002', displayName: 'Dine-in Customer 2' },
    update: { displayName: 'Dine-in Customer 2' },
  });
  console.log(`Customers seeded: ${customer1.id}, ${customer2.id}`);

  console.log('Chowly database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
