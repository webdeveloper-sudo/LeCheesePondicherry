const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const axios = require("axios");

// Load env vars from server directory
dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../models/Product");
const { uploadFile } = require("../utils/googleDrive");

// Product Data from products.ts (Extracted manually for script reliability)
const productsData = [
  {
    id: "baby-swiss",
    name: "Baby Swiss",
    shortDescription: "Toasted Bread & Fondue Cheese - Aged 2 Months",
    description:
      "A Swiss-styled masterpiece, aged for 2 months to develop a mild, nutty flavor with a subtle tang. Perfect for melting, its characteristic small eyes and smooth texture make it a gourmet favorite.",
    price: 320,
    originalPrice: 500,
    imagePath: "baby-swiss-package.png",
    imagesPaths: [
      "baby-swiss-package.png",
      "baby-swiss-texture.png",
      "baby-swiss-pairing.png",
    ],
    category: "aged",
    weight: "200g",
    inStock: true,
    featured: true,
    ingredients: "A2 Cow Milk, Culture, Vegetarian Rennet, Salt",
  },
  {
    id: "daddy-swiss",
    name: "Daddy Swiss",
    shortDescription: "The King of Swiss - Aged 4 Months",
    description:
      "A bolder, more matured version of our Swiss style. Aged for 4 months, Daddy Swiss develops larger eyes and a significantly deeper nutty profile with a sophisticated finish.",
    price: 350,
    originalPrice: 500,
    imagePath: "daddy-swiss-package.png",
    imagesPaths: [
      "daddy-swiss-package.png",
      "daddy-swiss-texture.png",
      "daddy-swiss-pairing.png",
    ],
    category: "aged",
    weight: "200g",
    inStock: true,
    featured: true,
    ingredients: "A2 Cow Milk, Culture, Vegetarian Rennet, Salt",
  },
  {
    id: "pondy-orange",
    name: "Pondy Orange",
    shortDescription: "Vibrant & Sharp Aged Cheddar Style",
    description:
      "Our take on the classic aged cheddar. Vibrant in color and sharp in flavor, this cheese is aged to perfection to achieve a complex, savory profile that stands out on any platter.",
    price: 320,
    originalPrice: 500,
    imagePath: "pondy-orange-package.png",
    imagesPaths: [
      "pondy-orange-package.png",
      "pondy-orange-texture.png",
      "pondy-orange-pairing.png",
    ],
    category: "aged",
    weight: "200g",
    inStock: true,
    featured: true,
    ingredients:
      "A2 Cow Milk, Annatto (Natural Color), Culture, Vegetarian Rennet, Salt",
  },
  {
    id: "grana-chery",
    name: "Grana Chéry",
    shortDescription: "Aged 9 Months - The Umami Powerhouse",
    description:
      "A hard, granular cheese inspired by the Italian Grana tradition. Aged for 9 months, it develops a crystalline texture and an explosion of savory umami flavors.",
    price: 350,
    originalPrice: 500,
    imagePath: "grana-chery-package.png",
    imagesPaths: [
      "grana-chery-package.png",
      "grana-chery-texture.png",
      "grana-chery-pairing.png",
    ],
    category: "aged",
    weight: "200g",
    inStock: true,
    featured: true,
    ingredients: "A2 Cow Milk, Culture, Vegetarian Rennet, Salt",
  },
  {
    id: "burrata",
    name: "Burrata",
    shortDescription: "The Queen of Fresh Cheeses - Creamy Center",
    description:
      "A delicate pouch of fresh mozzarella that hides a decadent heart of stracciatella and cream. When broken, its creamy center flows out, creating a luxurious culinary experience that defines artisan indulgence.",
    price: 300,
    originalPrice: 350,
    imagePath: "burrata-package.png",
    imagesPaths: ["burrata-package.png"],
    category: "fresh",
    weight: "200g",
    inStock: true,
    featured: true,
    ingredients: "Fresh Cow Milk, Cream, Culture, Vegetarian Rennet, Salt",
  },
  {
    id: "mozzarella",
    name: "Mozzarella",
    shortDescription: "Fresh, Milky & Elastic - Handmade Specialty",
    description:
      "Authentic handmade mozzarella balls stored in fresh brine. Known for its distinctively milky flavor and satisfying elastic texture, it is the cornerstone of Mediterranean cuisine.",
    price: 225,
    originalPrice: 250,
    imagePath: "mozzarella-package.png",
    imagesPaths: ["mozzarella-package.png", "mozzarella-texture.png"],
    category: "fresh",
    weight: "200g",
    inStock: true,
    featured: true,
    ingredients: "Fresh Cow Milk, Culture, Vegetarian Rennet, Salt",
  },
  {
    id: "bocconcini",
    name: "Bocconcini",
    shortDescription: "Bite-sized Mozzarella Pearls",
    description:
      'Adorable, bite-sized "little mouthfuls" of fresh mozzarella. Perfect for salads, skewers, or snacking, these pearls carry the same premium quality as our whole mozzarella. Each pearl is a burst of fresh, milky goodness.',
    price: 60,
    originalPrice: 100,
    imagePath: "bocconcini-package.png",
    imagesPaths: ["bocconcini-package.png"],
    category: "fresh",
    weight: "50g",
    inStock: true,
    ingredients: "Fresh Cow Milk, Culture, Vegetarian Rennet, Salt",
  },
  {
    id: "ricotta",
    name: "Ricotta",
    shortDescription: "Light, Fluffy & Sweet - The Baker's Delight",
    description:
      "A fresh, creamy curd cheese with a light and airy texture. Naturally sweet and low in fat, our Ricotta is versatile enough for both savory pasta dishes and decadent desserts.",
    price: 225,
    originalPrice: 250,
    imagePath: "ricotta-package.png",
    imagesPaths: ["ricotta-package.png"],
    category: "fresh",
    weight: "200g",
    inStock: true,
    ingredients: "Cow Milk Whey/Milk, Culture, Salt",
  },
  {
    id: "halloumi",
    name: "Halloumi",
    shortDescription: "The Grilling Cheese - High Melting Point",
    description:
      'Our signature Grilling Cheese. Known for its incredibly high melting point, Halloumi can be pan-seared or grilled until golden brown, resulting in a savory, "squeaky" delight that is incomparable when warm.',
    price: 300,
    originalPrice: 350,
    imagePath: "halloumi-package.png",
    imagesPaths: ["halloumi-package.png"],
    category: "specialty",
    weight: "200g",
    inStock: true,
    featured: true,
    ingredients: "Cow Milk, Culture, Vegetarian Rennet, Salt, Dried Mint",
  },
  {
    id: "feta",
    name: "Feta",
    shortDescription: "Tangy & Crumbly - A Mediterranean Staple",
    description:
      "A classic white brined cheese with a characteristic tangy flavor and crumbly texture. Perfect for Greek salads, pastries, or as a salty accent to roasted vegetables. Our Feta is aged in brine to peak maturity.",
    price: 275,
    originalPrice: 320,
    imagePath: "feta-package.png",
    imagesPaths: ["feta-package.png"],
    category: "specialty",
    weight: "200g",
    inStock: true,
    ingredients: "Cow Milk, Brine, Culture, Vegetarian Rennet, Salt",
  },
  {
    id: "pizzaella",
    name: "Pizzaella",
    shortDescription: "The Ultimate Melting Mozzarella",
    description:
      "Specially crafted for the perfect melt. Our Pizzaella is a low-moisture mozzarella designed to bubble and brown beautifully over pizzas, lasagnas, and gratins. It provides the iconic stretch that every cheese lover craves.",
    price: 225,
    originalPrice: 300,
    imagePath: "pizzaella-package.png",
    imagesPaths: ["pizzaella-package.png"],
    category: "melting",
    weight: "200g",
    inStock: true,
    ingredients: "Cow Milk, Culture, Vegetarian Rennet, Salt",
  },
  {
    id: "cottage-cheese",
    name: "Cottage Cheese",
    shortDescription: "Soft & Crumbly Salad Cheese",
    description:
      "Natural, handmade artisanal cottage cheese made from cow milk. Fresh cheese with soft and crumbly texture, perfect for salads, dips, and healthy snacking. Indian specialty cheese made with traditional methods.",
    price: 110,
    originalPrice: 120,
    imagePath: "cottage-cheese-package.png",
    imagesPaths: ["cottage-cheese-package.png"],
    category: "fresh",
    weight: "200g",
    inStock: true,
    ingredients: "Cow Milk, Culture, Salt",
  },
];

const PUBLIC_IMAGES_DIR = path.join(
  __dirname,
  "../../client/public/images/products",
);

async function seedProducts() {
  try {
    console.log("🌱 Starting Product Seeding...");

    const dbUri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME;

    if (!dbUri) throw new Error("MONGODB_URI missing in .env");

    await mongoose.connect(dbUri, { dbName });
    console.log("🔌 Connected to MongoDB");

    // Clear existing products
    console.log("🧹 Clearing existing products...");
    await Product.deleteMany({});

    for (const prod of productsData) {
      console.log(`\n📦 Processing: ${prod.name}`);

      const imageUrls = [];

      // Upload images to Drive
      for (const imgName of prod.imagesPaths) {
        const imgPath = path.join(PUBLIC_IMAGES_DIR, imgName);
        if (fs.existsSync(imgPath)) {
          const base64Data = fs.readFileSync(imgPath).toString("base64");
          const mimeType = "image/png"; // Default to png as per directory listing

          try {
            console.log(`   📡 Uploading ${imgName}...`);
            const url = await uploadFile(imgName, mimeType, base64Data);
            imageUrls.push(url);
          } catch (uploadError) {
            console.error(
              `   ❌ Failed to upload ${imgName}:`,
              uploadError.message,
            );
          }
        } else {
          console.warn(`   ⚠️ Image not found: ${imgPath}`);
        }
      }

      // Save to DB
      const finalProduct = {
        ...prod,
        image: imageUrls.length > 0 ? imageUrls[0] : "",
        images: imageUrls,
        googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID,
      };

      // Clean up internal paths
      delete finalProduct.imagePath;
      delete finalProduct.imagesPaths;

      await Product.create(finalProduct);
      console.log(`✅ ${prod.name} saved with ${imageUrls.length} images.`);
    }

    console.log("\n✨ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Seeding failed:", error.message);
    process.exit(1);
  }
}

seedProducts();
