/**
 * Seed Script - Populate database with initial data
 * Run: node config/seed.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Menu = require('../models/Menu');
const User = require('../models/User');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected to MongoDB');
};

const menuItems = [
  // Coffee
  {
    name: 'Signature Black',
    description: 'Single origin Arabica, bold and complex with notes of dark chocolate and citrus',
    price: 28000,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400',
    isAvailable: true,
    isFeatured: true,
    isPromo: false,
  },
  {
    name: 'Caramel Latte',
    description: 'Smooth espresso with steamed milk and house-made caramel sauce',
    price: 35000,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400',
    isAvailable: true,
    isFeatured: true,
    isPromo: true,
    promoPrice: 28000,
  },
  {
    name: 'Matcha Latte',
    description: 'Premium Japanese matcha with oat milk, earthy and creamy',
    price: 38000,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
    isAvailable: true,
    isFeatured: false,
    isPromo: false,
  },
  {
    name: 'Cold Brew',
    description: '18-hour cold brewed coffee, smooth and refreshing with low acidity',
    price: 32000,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    isAvailable: true,
    isFeatured: true,
    isPromo: false,
  },
  {
    name: 'Espresso Tonic',
    description: 'Double espresso over sparkling tonic water with citrus twist',
    price: 33000,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1579888071069-c107a6f61a52?w=400',
    isAvailable: true,
    isFeatured: false,
    isPromo: false,
  },
  {
    name: 'Dirty Chai',
    description: 'Spiced chai tea with a shot of espresso and steamed milk',
    price: 36000,
    category: 'coffee',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400',
    isAvailable: true,
    isFeatured: false,
    isPromo: true,
    promoPrice: 29000,
  },
  // Non-Coffee
  {
    name: 'Chocolate Hazel',
    description: 'Rich hot chocolate with hazelnut syrup and whipped cream',
    price: 34000,
    category: 'non-coffee',
    image: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400',
    isAvailable: true,
    isFeatured: false,
    isPromo: false,
  },
  {
    name: 'Strawberry Smoothie',
    description: 'Fresh strawberries blended with yogurt and honey',
    price: 36000,
    category: 'non-coffee',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a90bb5ae?w=400',
    isAvailable: true,
    isFeatured: false,
    isPromo: false,
  },
  {
    name: 'Lemon Ginger Tea',
    description: 'Fresh ginger infused tea with lemon and honey',
    price: 25000,
    category: 'non-coffee',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    isAvailable: true,
    isFeatured: false,
    isPromo: false,
  },
  // Snacks
  {
    name: 'Croissant Almond',
    description: 'Buttery flaky croissant filled with almond cream and topped with sliced almonds',
    price: 28000,
    category: 'snack',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    isAvailable: true,
    isFeatured: true,
    isPromo: false,
  },
  {
    name: 'Avocado Toast',
    description: 'Sourdough bread with smashed avocado, cherry tomatoes, and everything bagel seasoning',
    price: 42000,
    category: 'snack',
    image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=400',
    isAvailable: true,
    isFeatured: false,
    isPromo: false,
  },
  {
    name: 'Banana Bread',
    description: 'House-baked moist banana bread with walnut and dark chocolate chips',
    price: 24000,
    category: 'snack',
    image: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400',
    isAvailable: true,
    isFeatured: false,
    isPromo: true,
    promoPrice: 18000,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Menu.deleteMany({});
    await User.deleteMany({});

    // Seed menu
    await Menu.insertMany(menuItems);
    console.log(`✅ Seeded ${menuItems.length} menu items`);

    // Create admin user - password akan di-hash otomatis oleh User model
    await User.create({
      name: 'Admin Kedai Kopi',
      email: 'admin@kedaikopi.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin user created: admin@kedaikopi.com / admin123');

    // Create test user - password akan di-hash otomatis oleh User model
    await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user',
    });
    console.log('✅ Test user created: user@test.com / user123');

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();