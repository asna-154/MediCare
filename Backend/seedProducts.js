const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const products = [
  {
    name: "Aspirin",
    description: "Pain reliever and fever reducer",
    price: 5.99,
    category: "pain-relief",
    icon: "fas fa-pills",
    rating: 4.5,
    reviews: 120
  },
  {
    name: "Vitamin C 1000mg",
    description: "Immune system support with high potency",
    price: 12.99,
    category: "vitamins",
    icon: "fas fa-apple-alt",
    rating: 4.8,
    reviews: 89,
    badge: "Bestseller"
  },
  {
    name: "Ibuprofen 200mg",
    description: "Anti-inflammatory pain reliever",
    price: 8.49,
    category: "pain-relief",
    icon: "fas fa-capsules",
    rating: 4.3,
    reviews: 204
  },
  {
    name: "Amoxicillin 500mg",
    description: "Antibiotic for bacterial infections",
    price: 24.99,
    category: "antibiotics",
    icon: "fas fa-prescription-bottle",
    rating: 4.6,
    reviews: 67,
    badge: "Prescription"
  },
  {
    name: "Cetirizine 10mg",
    description: "24-hour allergy relief",
    price: 7.99,
    category: "allergy",
    icon: "fas fa-allergies",
    rating: 4.4,
    reviews: 156
  },
  {
    name: "Metformin 500mg",
    description: "Diabetes medication",
    price: 18.50,
    category: "diabetes",
    icon: "fas fa-syringe",
    rating: 4.2,
    reviews: 89,
    badge: "Prescription"
  },
  {
    name: "Atorvastatin 20mg",
    description: "Cholesterol lowering medication",
    price: 22.75,
    category: "cardiology",
    icon: "fas fa-heartbeat",
    rating: 4.5,
    reviews: 112
  },
  {
    name: "Baby Diapers Size 3",
    description: "Super absorbent diapers for babies",
    price: 19.99,
    category: "baby-care",
    icon: "fas fa-baby",
    rating: 4.7,
    reviews: 305
  },
  {
    name: "First Aid Kit",
    description: "Complete emergency first aid supplies",
    price: 34.99,
    category: "first-aid",
    icon: "fas fa-first-aid",
    rating: 4.9,
    reviews: 189,
    badge: "Sale"
  },
  {
    name: "Sunscreen SPF 50",
    description: "Broad spectrum UVA/UVB protection",
    price: 14.99,
    category: "skincare",
    icon: "fas fa-spa",
    rating: 4.6,
    reviews: 243
  },
  {
    name: "Insulin Syringes",
    description: "Sterile disposable syringes",
    price: 12.49,
    category: "diabetes",
    icon: "fas fa-syringe",
    rating: 4.3,
    reviews: 78
  },
  {
    name: "Albuterol Inhaler",
    description: "Quick relief for asthma",
    price: 28.99,
    category: "respiratory",
    icon: "fas fa-lungs",
    rating: 4.7,
    reviews: 134,
    badge: "Prescription"
  }
];

async function seedProducts() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");
    
    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");
    
    // Insert new products
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products successfully!`);
    
    // Display what was added
    const count = await Product.countDocuments();
    console.log(`Total products in database: ${count}`);
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}

seedProducts();