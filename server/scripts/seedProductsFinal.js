const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const Product = require("../models/Product");
const { uploadFile } = require("../utils/googleDrive");

const PUBLIC_IMAGES_DIR = path.join(__dirname, "../../client/src/assets/images");

const migrateImage = async (relativePath) => {
  if (!relativePath || relativePath.startsWith("http")) return relativePath;
  try {
    // Handle the "@/assets/images/" prefix if present (from the ts file)
    let cleanPath = relativePath.replace("@/assets/images/", "");
    const absolutePath = path.join(PUBLIC_IMAGES_DIR, cleanPath);

    if (!fs.existsSync(absolutePath)) {
      console.warn(`   ⚠️ File not found: ${absolutePath}`);
      return "";
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    const base64Data = fileBuffer.toString("base64");
    const fileName = path.basename(absolutePath);
    const mimeType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";

    console.log(`   📤 Migrating ${fileName}...`);
    const driveUrl = await uploadFile(fileName, mimeType, base64Data);
    return driveUrl;
  } catch (error) {
    console.error(`   ❌ Migration failed for ${relativePath}:`, error.message);
    return "";
  }
};

const productsData = [
  {
    id: "baby-swiss",
    name: "Baby Swiss",
    shortDescription: "Mild & Gently Sweet",
    description: "Baby Swiss is aged for three months, resulting in a mild flavour and smooth texture with small eyes.",
    price: 420,
    originalPrice: 550,
    imagePath: "products/baby-swiss-package.png",
    imagesPaths: ["products/baby-swiss-package.png", "products/baby-swiss-texture.png", "products/baby-swiss-pairing.png"],
    category: "aged",
    rating: 5,
    reviews: 45,
    weight: "200g",
    inStock: true,
    featured: true,
    tastingNotes: {
      appearance: "Pale yellow with small holes",
      texture: "Semi-firm and smooth",
      aroma: "Light and nutty",
      flavor: "Mild and slightly sweet",
      finish: "Clean and mellow",
    },
    pairings: ["Sandwiches", "Baking"],
    ingredients: "Cow milk, cultures, salt, Veg Rennet",
  },
  {
    id: "daddy-swiss",
    name: "Daddy Swiss",
    shortDescription: "Rich, Mature Swiss-Style",
    description: "Daddy Swiss is aged for five to six months, giving it deeper flavour and firmer structure compared to Baby Swiss.",
    price: 450,
    originalPrice: 600,
    imagePath: "products/daddy-swiss-package.png",
    imagesPaths: ["products/daddy-swiss-package.png", "products/daddy-swiss-texture.png", "products/daddy-swiss-pairing.png"],
    category: "aged",
    rating: 5,
    reviews: 32,
    weight: "200g",
    inStock: true,
    featured: true,
    tastingNotes: {
      appearance: "Yellow block with medium holes",
      texture: "Firm and elastic",
      aroma: "Nutty and dairy-rich",
      flavor: "Fuller and savoury",
      finish: "Long and satisfying",
    },
    pairings: ["Cooking", "Melting", "Hot dishes"],
    ingredients: "Cow milk, cultures, salt, Veg rennet",
  },
  {
    id: "pondyorange",
    name: "Pondy Orange",
    shortDescription: "Smooth, Mature & Versatile",
    description: "Pondy Orange is a semi-hard cheese aged for around six months to develop balanced flavour and smooth texture. Suitable for slicing, melting, and everyday cooking.",
    price: 420,
    originalPrice: 560,
    imagePath: "products/pondy-orange-package.png",
    imagesPaths: ["products/pondy-orange-package.png", "products/pondy-orange-texture.png", "products/pondy-orange-pairing.png"],
    category: "aged",
    rating: 4,
    reviews: 28,
    weight: "200g",
    inStock: true,
    featured: true,
    tastingNotes: {
      appearance: "Pale yellow block",
      texture: "Firm and smooth",
      aroma: "Mildly sharp",
      flavor: "Rich and savoury",
      finish: "Clean and satisfying",
    },
    pairings: ["Sandwiches", "Sauces", "Burgers", "Pastas"],
    ingredients: "Cow milk, cultures, salt, veg rennet",
  },
  {
    id: "grana-chery",
    name: "Grana Cherry",
    shortDescription: "Hard, Aged & Grate-Ready",
    description: "Grana Cherry is a hard, parmesan-style cheese aged for nine months. Aging develops a dense texture and concentrated flavour suited for finishing dishes.",
    price: 450,
    originalPrice: 590,
    imagePath: "products/grana-chery-package.png",
    imagesPaths: ["products/grana-chery-package.png", "products/grana-chery-texture.png", "products/grana-chery-pairing.png"],
    category: "aged",
    rating: 5,
    reviews: 51,
    weight: "200g",
    inStock: true,
    featured: true,
    tastingNotes: {
      appearance: "Hard pale-yellow wheel or block",
      texture: "Hard and granular",
      aroma: "Intense and nutty",
      flavor: "Savoury, umami-rich",
      finish: "Long, complex, and satisfying",
    },
    pairings: ["Pasta", "Risotto", "Soups"],
    ingredients: "Cow milk, cultures, salt, veg Rennet",
  },
  {
    id: "burrata",
    name: "Burrata",
    shortDescription: "Creamy Inside, Glossy Outside",
    description: "Burrata features a delicate outer shell filled with a rich, creamy centre. It is best consumed fresh and served simply to appreciate its texture and flavour.",
    price: 175,
    originalPrice: 240,
    imagePath: "products/burrata-package.png",
    imagesPaths: ["products/burrata-package.png"],
    category: "fresh",
    rating: 5,
    reviews: 64,
    weight: "140g",
    inStock: true,
    featured: true,
    tastingNotes: {
      appearance: "Smooth white pouch",
      texture: "Soft outside with a creamy centre",
      aroma: "Fresh and milky",
      flavor: "Mild, rich, and creamy",
      finish: "Silky and clean",
    },
    pairings: ["Fresh salads", "Bread", "Olive oil"],
    ingredients: "Cow milk, cream, salt, veg rennet",
  },
  {
    id: "mozzarella",
    name: "Fresh Mozzarella",
    shortDescription: "Soft, Fresh & Gently Melting",
    description: "Fresh mozzarella is a soft, moist cheese with a clean, milky flavour. It melts gently and is suited for fresh preparations as well as light cooking.",
    price: 300,
    originalPrice: 390,
    imagePath: "products/mozzarella-package.png",
    imagesPaths: ["products/mozzarella-package.png", "products/mozzarella-texture.png"],
    category: "fresh",
    rating: 5,
    reviews: 48,
    weight: "200g",
    inStock: true,
    featured: true,
    tastingNotes: {
      appearance: "Smooth white ball",
      texture: "Soft and moist",
      aroma: "Fresh and milky",
      flavor: "Mild and creamy",
      finish: "Refreshing and clean",
    },
    pairings: ["Salads", "Tomatoes", "Olive oil", "Pasta"],
    ingredients: "Cow milk, cultures, salt, veg rennet",
  },
  {
    id: "bocconcini",
    name: "Bocconcini",
    shortDescription: "Small, Fresh & Mild",
    description: "Bocconcini are small mozzarella balls with a soft texture and mild dairy flavour. Easy to portion and versatile in both fresh and lightly cooked dishes.",
    price: 300,
    originalPrice: 410,
    imagePath: "products/bocconcini-package.png",
    imagesPaths: ["products/bocconcini-package.png"],
    category: "fresh",
    rating: 4,
    reviews: 22,
    weight: "200g",
    inStock: true,
    tastingNotes: {
      appearance: "Small white balls",
      texture: "Soft and moist",
      aroma: "Light and milky",
      flavor: "Mild and clean",
      finish: "Light and refreshing",
    },
    pairings: ["Salads", "Skewers", "Appetisers"],
    ingredients: "Cow milk, cultures, salt, veg rennet",
  },
  {
    id: "ricotta",
    name: "Ricotta",
    shortDescription: "Light & Whey-Based",
    description: "Ricotta is a fresh cheese made from whey, giving it a lighter texture than milk-based cheeses. It works well in both savoury and sweet dishes.",
    price: 275,
    originalPrice: 370,
    imagePath: "products/ricotta-package.png",
    imagesPaths: ["products/ricotta-package.png"],
    category: "fresh",
    rating: 5,
    reviews: 36,
    weight: "200g",
    inStock: true,
    tastingNotes: {
      appearance: "Soft white curds",
      texture: "Light and grainy",
      aroma: "Mild and fresh",
      flavor: "Slightly sweet and milky",
      finish: "Clean and fresh",
    },
    pairings: ["Pasta", "Desserts", "Spreads", "Baking"],
    ingredients: "Whey, milk solids, salt",
  },
  {
    id: "halloumi",
    name: "Halloumi",
    shortDescription: "The Grilling Cheese – High Heat Stable",
    description: "Halloumi is a heat-stable cheese made for high-temperature cooking. It softens when heated but does not melt, forming a golden crust when grilled or pan-fried.",
    price: 360,
    originalPrice: 480,
    imagePath: "products/halloumi-package.png",
    imagesPaths: ["products/halloumi-package.png"],
    category: "specialty",
    rating: 5,
    reviews: 42,
    weight: "200g",
    inStock: true,
    featured: true,
    tastingNotes: {
      appearance: "Off-white block",
      texture: "Firm and slightly elastic, squeaky when bitten",
      aroma: "Mild and milky",
      flavor: "Lightly salty and rich when heated",
      finish: "Clean and satisfying",
    },
    pairings: ["Grilled vegetables", "Salads", "Wraps", "Lemon"],
    ingredients: "Cow milk, salt, veg rennet",
  },
  {
    id: "feta",
    name: "Fetta",
    shortDescription: "Crumbly & Brined",
    description: "Feta is a brined cheese with a crumbly texture and balanced saltiness. It adds brightness and contrast to salads and baked dishes.",
    price: 360,
    originalPrice: 490,
    imagePath: "products/feta-package.png",
    imagesPaths: ["products/feta-package.png"],
    category: "specialty",
    rating: 4,
    reviews: 31,
    weight: "200g",
    inStock: true,
    featured: true,
    tastingNotes: {
      appearance: "White crumbly blocks",
      texture: "Crumbly and moist",
      aroma: "Clean and briny",
      flavor: "Salty and tangy",
      finish: "Zesty and lingering",
    },
    pairings: ["Salads", "Vegetables", "Baking"],
    ingredients: "Cow milk, veg rennet, salt",
  },
  {
    id: "pizzaella",
    name: "Pizzaella",
    shortDescription: "Built for High-Heat Cooking",
    description: "Pizzaella is a block-style mozzarella developed for high-temperature applications. It delivers controlled melt and stretch with minimal moisture release.",
    price: 275,
    originalPrice: 360,
    imagePath: "products/pizzaella-package.png",
    imagesPaths: ["products/pizzaella-package.png"],
    category: "melting",
    rating: 5,
    reviews: 55,
    weight: "200g",
    inStock: true,
    tastingNotes: {
      appearance: "White rectangular block",
      texture: "Firm and elastic",
      aroma: "Mild dairy aroma",
      flavor: "Clean and milky when melted",
      finish: "Satisfyingly clean",
    },
    pairings: ["Pizza", "Sandwiches", "Baked dishes"],
    ingredients: "Cow milk, cultures, salt, veg rennet",
  },
  {
    id: "paneer",
    name: "Paneer",
    shortDescription: "Non-Melting Cooking Cheese",
    description: "Paneer is a fresh, heat-stable cheese widely used in Indian cooking. It holds its shape during frying and gravies while absorbing flavours well.",
    price: 110,
    originalPrice: 150,
    imagePath: "products/cottage-cheese-package.png",
    imagesPaths: ["products/cottage-cheese-package.png"],
    category: "fresh",
    rating: 5,
    reviews: 89,
    weight: "200g",
    inStock: true,
    tastingNotes: {
      appearance: "White block",
      texture: "Firm and crumbly",
      aroma: "Neutral dairy aroma",
      flavor: "Mild and milky",
      finish: "Clean and fresh",
    },
    pairings: ["Curries", "Grilling", "Stir-frying"],
    ingredients: "Cow milk, food-grade Coagulant, salt",
  },
  {
    id: "skyr",
    name: "Skyr",
    shortDescription: "Thick, High-Protein Cultured Dairy",
    description: "Skyr is a thick, cultured dairy product made using traditional fermentation methods. It has a smooth, dense texture with a mild tang.",
    price: 250,
    originalPrice: 340,
    imagePath: "products/ricotta-package.png",
    imagesPaths: ["products/ricotta-package.png"],
    category: "fresh",
    rating: 5,
    reviews: 42,
    weight: "200g",
    inStock: true,
    tastingNotes: {
      appearance: "Thick, smooth white curd",
      texture: "Dense and creamy",
      aroma: "Clean and mildly tangy",
      flavor: "Fresh, lightly sour, and creamy",
      finish: "Refreshing and clean",
    },
    pairings: ["Fruits", "Honey", "Granola", "Savoury bowls"],
    ingredients: "Cow milk, live cultures",
  },
  {
    id: "brie-traditional",
    name: "Traditional Brie",
    shortDescription: "Creamy, Buttery & Elegant",
    description: "A classic soft-ripened cheese with a velvety white rind and a luscious, meltingly soft interior. Handcrafted for premium dining experiences.",
    price: 520,
    originalPrice: 650,
    imagePath: "products/classic-brie.jpg",
    imagesPaths: ["products/classic-brie.jpg", "products/classic-brie-alt1.png", "products/classic-brie-alt2.png"],
    category: "specialty",
    rating: 5,
    reviews: 42,
    weight: "125g",
    inStock: true,
    ingredients: "Cow milk, cream, cultures, salt, Penicillium candidum",
  },
  {
    id: "kombucha-rind",
    name: "Kombucha Rind",
    shortDescription: "Unique Fermented Character",
    description: "An innovative artisanal cheese featuring a rind nurtured with locally brewed kombucha, creating unique floral notes and deep complexity.",
    price: 550,
    originalPrice: 680,
    imagePath: "products/kombucha-rind.jpg",
    imagesPaths: ["products/kombucha-rind.jpg", "products/kombucha-rind-alt1.png", "products/kombucha-rind-alt2.png"],
    category: "specialty",
    rating: 5,
    reviews: 28,
    weight: "150g",
    inStock: true,
    featured: true,
    ingredients: "Cow milk, cultures, salt, Kombucha culture, Penicillium candidum",
  }
];

const seedProducts = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing in .env");
    
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || "LeCheesePondyDB"
    });
    console.log(`🟢 Connected to MongoDB: ${process.env.DB_NAME || "LeCheesePondyDB"}`);

    console.log("🧹 Clearing existing products...");
    await Product.deleteMany({});

    console.log(`📦 Seeding ${productsData.length} products...`);
    
    for (const p of productsData) {
      console.log(`\n🔹 Processing: ${p.name}`);
      
      const imageUrls = [];
      if (p.imagesPaths) {
        for (const imgPath of p.imagesPaths) {
          const url = await migrateImage(imgPath);
          if (url) imageUrls.push(url);
        }
      } else if (p.imagePath) {
        const url = await migrateImage(p.imagePath);
        if (url) imageUrls.push(url);
      }

      const finalProduct = {
        ...p,
        slug: p.id,
        image: imageUrls.length > 0 ? imageUrls[0] : "",
        images: imageUrls,
        googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID
      };

      delete finalProduct.imagePath;
      delete finalProduct.imagesPaths;

      await Product.create(finalProduct);
      console.log(`✅ ${p.name} seeded successfully.`);
    }

    console.log("\n✨ Database Seeding Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedProducts();
