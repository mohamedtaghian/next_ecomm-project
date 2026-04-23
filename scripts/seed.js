/**
 * FreshCart Database Seed Script
 * Run: node scripts/seed.js
 *
 * Seeds: 1 admin user + sample categories, brands, and products
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not set in .env.local");
  process.exit(1);
}

// ─── Inline schemas (avoid ES module issues in seed script) ──────────────────

const userSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, phone: String, password: String, role: { type: String, default: "customer" }, active: { type: Boolean, default: true }, wishlist: [] }, { timestamps: true });
const categorySchema = new mongoose.Schema({ name: String, slug: String, image: String }, { timestamps: true });
const brandSchema = new mongoose.Schema({ name: String, slug: String, image: String }, { timestamps: true });
const productSchema = new mongoose.Schema({ title: String, slug: String, description: String, quantity: Number, sold: { type: Number, default: 0 }, price: Number, priceAfterDiscount: Number, imageCover: String, images: [String], category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }, brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" }, ratingsAverage: { type: Number, default: 0 }, ratingsQuantity: { type: Number, default: 0 } }, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Category = mongoose.models.Category || mongoose.model("Category", categorySchema);
const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// ─── Seed Data ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: "Electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400" },
  { name: "Fresh Produce", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400" },
  { name: "Dairy & Eggs", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400" },
  { name: "Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400" },
  { name: "Beverages", image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400" },
  { name: "Snacks", image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400" },
];

const BRANDS = [
  { name: "Apple", image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
  { name: "Samsung", image: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
  { name: "Nestlé", image: "https://upload.wikimedia.org/wikipedia/en/c/c8/Nestl%C3%A9.svg" },
  { name: "Danone", image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Danone_logo.svg" },
  { name: "Pepsico", image: "https://upload.wikimedia.org/wikipedia/commons/0/04/PepsiCo_logo.svg" },
];

async function seed() {
  console.log("🌱  Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅  Connected\n");

  // Clear existing
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Product.deleteMany({}),
  ]);
  console.log("🗑️   Cleared existing data\n");

  // Admin user
  const hashedPassword = await bcrypt.hash("Admin@1234", 12);
  const admin = await User.create({
    name: "Admin User",
    email: "admin@freshcart.com",
    phone: "01012345678",
    password: hashedPassword,
    role: "admin",
    active: true,
  });
  console.log("👤  Admin created:", admin.email);
  console.log("    Password: Admin@1234\n");

  // Categories
  const cats = await Category.insertMany(
    CATEGORIES.map((c) => ({ ...c, slug: c.name.toLowerCase().replace(/ /g, "-") }))
  );
  console.log(`📂  Created ${cats.length} categories`);

  // Brands
  const brands = await Brand.insertMany(
    BRANDS.map((b) => ({ ...b, slug: b.name.toLowerCase().replace(/ /g, "-") }))
  );
  console.log(`🏷️   Created ${brands.length} brands`);

  // Products (2 per category)
  const PRODUCTS = [
    { title: "iPhone 15 Pro", description: "The latest Apple iPhone with titanium design and A17 Pro chip. Stunning 48MP camera system.", price: 45000, quantity: 50, imageCover: "https://images.unsplash.com/photo-1696446701796-da61c6a2b7d4?w=500", images: ["https://images.unsplash.com/photo-1696446701796-da61c6a2b7d4?w=500"], categoryIdx: 0, brandIdx: 0 },
    { title: "Samsung Galaxy S24", description: "Samsung flagship phone with Galaxy AI and pro-grade camera. 200MP main sensor.", price: 38000, priceAfterDiscount: 34000, quantity: 30, imageCover: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500", images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500"], categoryIdx: 0, brandIdx: 1 },
    { title: "Organic Apples (1kg)", description: "Fresh organic apples sourced from local farms. Rich in vitamins and antioxidants.", price: 45, quantity: 200, imageCover: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500", images: ["https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500"], categoryIdx: 1, brandIdx: 2 },
    { title: "Fresh Strawberries (500g)", description: "Sweet and juicy strawberries picked at peak ripeness. Perfect for smoothies and desserts.", price: 60, priceAfterDiscount: 49, quantity: 100, imageCover: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500", images: ["https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500"], categoryIdx: 1, brandIdx: 2 },
    { title: "Full Fat Milk (1L)", description: "Fresh pasteurised full-fat cow's milk. Rich in calcium and vitamins.", price: 28, quantity: 300, imageCover: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500", images: ["https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500"], categoryIdx: 2, brandIdx: 3 },
    { title: "Free-Range Eggs (12pk)", description: "Farm-fresh free-range eggs. Hens raised with space to roam on natural feed.", price: 75, quantity: 150, imageCover: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500", images: ["https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500"], categoryIdx: 2, brandIdx: 3 },
    { title: "Sourdough Bread Loaf", description: "Traditional sourdough bread baked fresh daily. Crispy crust with a soft, chewy interior.", price: 55, quantity: 80, imageCover: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500", images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500"], categoryIdx: 3, brandIdx: 2 },
    { title: "Croissants (4pk)", description: "Buttery, flaky French-style croissants baked fresh every morning. Perfect with jam.", price: 40, priceAfterDiscount: 32, quantity: 60, imageCover: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500", images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500"], categoryIdx: 3, brandIdx: 2 },
    { title: "Pepsi 500ml (6pk)", description: "Classic Pepsi cola pack of 6 bottles. Refreshing and ice-cold taste.", price: 80, quantity: 500, imageCover: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500", images: ["https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500"], categoryIdx: 4, brandIdx: 4 },
    { title: "Nestlé Pure Life Water (12pk)", description: "Pure, clean drinking water. 12×500ml bottles, perfect for home and office.", price: 45, quantity: 400, imageCover: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500", images: ["https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500"], categoryIdx: 4, brandIdx: 2 },
    { title: "Mixed Nuts (300g)", description: "Premium mix of cashews, almonds, walnuts and pistachios. Lightly salted and roasted.", price: 120, quantity: 120, imageCover: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500", images: ["https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=500"], categoryIdx: 5, brandIdx: 2 },
    { title: "Dark Chocolate Bar (100g)", description: "Rich 70% dark chocolate with hints of vanilla. Ethically sourced cocoa.", price: 65, priceAfterDiscount: 55, quantity: 90, imageCover: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500", images: ["https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=500"], categoryIdx: 5, brandIdx: 2 },
  ];

  const products = await Product.insertMany(
    PRODUCTS.map((p) => ({
      title: p.title,
      slug: p.title.toLowerCase().replace(/ /g, "-").replace(/[()]/g, ""),
      description: p.description,
      price: p.price,
      priceAfterDiscount: p.priceAfterDiscount,
      quantity: p.quantity,
      imageCover: p.imageCover,
      images: p.images,
      category: cats[p.categoryIdx]._id,
      brand: brands[p.brandIdx]._id,
      ratingsAverage: (Math.random() * 2 + 3).toFixed(1),
      ratingsQuantity: Math.floor(Math.random() * 200),
    }))
  );
  console.log(`📦  Created ${products.length} products\n`);

  console.log("✅  Seed complete!");
  console.log("─────────────────────────────────");
  console.log("Admin login:");
  console.log("  Email:    admin@freshcart.com");
  console.log("  Password: Admin@1234");
  console.log("  Role:     admin");
  console.log("─────────────────────────────────\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
