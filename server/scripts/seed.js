const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const Blog = require("../models/Blog");
const { uploadFile } = require("../utils/googleDrive");

// Load env vars
dotenv.config({ path: path.join(__dirname, "../.env") });

const CLIENT_IMAGES_DIR = path.join(__dirname, "../../client/src/assets/images");

/**
 * Helper to read a local image and upload to Drive
 */
const migrateImage = async (relativePath) => {
  if (!relativePath || relativePath.startsWith("http")) return relativePath;
  try {
    let cleanPath = relativePath.replace("@/assets/images/", "");
    if (cleanPath.startsWith("/images/")) {
      // Handle public images if any (though mostly we have src/assets)
      console.warn(`⚠️ Skipping public image for now (manual migration suggested): ${relativePath}`);
      return relativePath;
    }
    const absolutePath = path.join(CLIENT_IMAGES_DIR, cleanPath);

    if (!fs.existsSync(absolutePath)) {
      console.warn(`⚠️ File not found: ${absolutePath}`);
      return "";
    }

    const fileBuffer = fs.readFileSync(absolutePath);
    const base64Data = fileBuffer.toString("base64");
    const fileName = path.basename(absolutePath);
    const mimeType = fileName.endsWith(".png") ? "image/png" : "image/jpeg";

    console.log(`📤 Migrating ${fileName}...`);
    const driveUrl = await uploadFile(fileName, mimeType, base64Data);
    return driveUrl;
  } catch (error) {
    console.error(`❌ Migration failed for ${relativePath}:`, error.message);
    return "";
  }
};

const seedData = async () => {
  try {
    if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing in .env");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🟢 Connected to MongoDB");

    console.log("🧨 Clearing existing collections...");
    await Product.deleteMany({});
    await Blog.deleteMany({});

    // --- Products Data ---
    const productsToSeed = [
      {
        id: "baby-swiss",
        name: "Baby Swiss",
        shortDescription: "Mild & Gently Sweet",
        description: "Baby Swiss is aged for three months, resulting in a mild flavour and smooth texture with small eyes.",
        price: 420,
        originalPrice: 550,
        image: "products/baby-swiss-package.png",
        images: ["products/baby-swiss-package.png", "products/baby-swiss-texture.png", "products/baby-swiss-pairing.png"],
        category: "aged",
        rating: 5,
        reviews: 45,
        weight: "200g",
        inStock: true,
        featured: true,
        tastingNotes: { appearance: "Pale yellow with small holes", texture: "Semi-firm and smooth", aroma: "Light and nutty", flavor: "Mild and slightly sweet", finish: "Clean and mellow" },
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
        image: "products/daddy-swiss-package.png",
        images: ["products/daddy-swiss-package.png", "products/daddy-swiss-texture.png", "products/daddy-swiss-pairing.png"],
        category: "aged",
        rating: 5,
        reviews: 32,
        weight: "200g",
        inStock: true,
        featured: true,
        tastingNotes: { appearance: "Yellow block with medium holes", texture: "Firm and elastic", aroma: "Nutty and dairy-rich", flavor: "Fuller and savoury", finish: "Long and satisfying" },
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
        image: "products/pondy-orange-package.png",
        images: ["products/pondy-orange-package.png", "products/pondy-orange-texture.png", "products/pondy-orange-pairing.png"],
        category: "aged",
        rating: 4.5,
        reviews: 28,
        weight: "200g",
        inStock: true,
        featured: true,
        tastingNotes: { appearance: "Pale yellow block", texture: "Firm and smooth", aroma: "Mildly sharp", flavor: "Rich and savoury", finish: "Clean and satisfying" },
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
        image: "products/grana-chery-package.png",
        images: ["products/grana-chery-package.png", "products/grana-chery-texture.png", "products/grana-chery-pairing.png"],
        category: "aged",
        rating: 5,
        reviews: 51,
        weight: "200g",
        inStock: true,
        featured: true,
        tastingNotes: { appearance: "Hard pale-yellow wheel or block", texture: "Hard and granular", aroma: "Intense and nutty", flavor: "Savoury, umami-rich", finish: "Long, complex, and satisfying" },
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
        image: "products/burrata-package.png",
        images: ["products/burrata-package.png"],
        category: "fresh",
        rating: 5,
        reviews: 64,
        weight: "140g",
        inStock: true,
        featured: true,
        tastingNotes: { appearance: "Smooth white pouch", texture: "Soft outside with a creamy centre", aroma: "Fresh and milky", flavor: "Mild, rich, and creamy", finish: "Silky and clean" },
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
        image: "products/mozzarella-package.png",
        images: ["products/mozzarella-package.png", "products/mozzarella-texture.png"],
        category: "fresh",
        rating: 5,
        reviews: 48,
        weight: "200g",
        inStock: true,
        featured: true,
        tastingNotes: { appearance: "Smooth white ball", texture: "Soft and moist", aroma: "Fresh and milky", flavor: "Mild and creamy", finish: "Refreshing and clean" },
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
        image: "products/bocconcini-package.png",
        images: ["products/bocconcini-package.png"],
        category: "fresh",
        rating: 4,
        reviews: 22,
        weight: "200g",
        inStock: true,
        tastingNotes: { appearance: "Small white balls", texture: "Soft and moist", aroma: "Light and milky", flavor: "Mild and clean", finish: "Light and refreshing" },
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
        image: "products/ricotta-package.png",
        images: ["products/ricotta-package.png"],
        category: "fresh",
        rating: 5,
        reviews: 36,
        weight: "200g",
        inStock: true,
        tastingNotes: { appearance: "Soft white curds", texture: "Light and grainy", aroma: "Mild and fresh", flavor: "Slightly sweet and milky", finish: "Clean and fresh" },
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
        image: "products/halloumi-package.png",
        images: ["products/halloumi-package.png"],
        category: "specialty",
        rating: 5,
        reviews: 42,
        weight: "200g",
        inStock: true,
        featured: true,
        tastingNotes: { appearance: "Off-white block", texture: "Firm and slightly elastic, squeaky when bitten", aroma: "Mild and milky", flavor: "Lightly salty and rich when heated", finish: "Clean and satisfying" },
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
        image: "products/feta-package.png",
        images: ["products/feta-package.png"],
        category: "specialty",
        rating: 4,
        reviews: 31,
        weight: "200g",
        inStock: true,
        featured: true,
        tastingNotes: { appearance: "White crumbly blocks", texture: "Crumbly and moist", aroma: "Clean and briny", flavor: "Salty and tangy", finish: "Zesty and lingering" },
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
        image: "products/pizzaella-package.png",
        images: ["products/pizzaella-package.png"],
        category: "melting",
        rating: 5,
        reviews: 55,
        weight: "200g",
        inStock: true,
        tastingNotes: { appearance: "White rectangular block", texture: "Firm and elastic", aroma: "Mild dairy aroma", flavor: "Clean and milky when melted", finish: "Satisfyingly clean" },
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
        image: "products/cottage-cheese-package.png",
        images: ["products/cottage-cheese-package.png"],
        category: "fresh",
        rating: 5,
        reviews: 89,
        weight: "200g",
        inStock: true,
        tastingNotes: { appearance: "White block", texture: "Firm and crumbly", aroma: "Neutral dairy aroma", flavor: "Mild and milky", finish: "Clean and fresh" },
        pairings: ["Curries", "Grilling", "Stir-frying"],
        ingredients: "Cow milk, food-grade Coagulant, salt",
      },
      {
        id: "brie-traditional",
        name: "Traditional Brie",
        shortDescription: "Creamy, Buttery & Elegant",
        description: "A classic soft-ripened cheese with a velvety white rind and a luscious, meltingly soft interior. Handcrafted for premium dining experiences.",
        price: 520,
        originalPrice: 650,
        image: "products/classic-brie.jpg",
        images: ["products/classic-brie.jpg", "products/classic-brie-alt1.png", "products/classic-brie-alt2.png"],
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
        image: "products/kombucha-rind.jpg",
        images: ["products/kombucha-rind.jpg", "products/kombucha-rind-alt1.png", "products/kombucha-rind-alt2.png", "products/kombucha-rind-alt3.png"],
        category: "specialty",
        rating: 5,
        reviews: 28,
        weight: "150g",
        inStock: true,
        featured: true,
        ingredients: "Cow milk, cultures, salt, Kombucha culture, Penicillium candidum",
      }
    ];

    // --- Blogs Data ---
    const blogsToSeed = [
      {
        id: "farm-to-fromage",
        title: "From Farm to Fromage: The Art Behind Artisanal Cheese",
        date: "May 12, 2024",
        author: "Admin",
        authorRole: "Master Cheesemaker",
        authorImage: "/images/team/chef-1.jpg",
        category: "Tradition",
        image: "products/aged-cheddar.jpg",
        excerpt: "In a world of mass-produced dairy, true artisanal cheese stands apart. It is not simply a food product — it is a craft shaped by patience, science, and tradition...",
        tags: ["Artisan", "Farm", "Tradition", "Pondicherry"],
        gallery: ["products/aged-cheddar.jpg", "products/classic-brie.jpg", "products/kombucha-rind.jpg", "products/baby-swiss-texture.png", "products/daddy-swiss-texture.png", "products/grana-chery-texture.png"],
        quote: { text: "Just as fine wine reflects its terroir, great cheese reflects the land, the animals, and the people behind it.", author: "Le Pondicherry Cheese" },
        content: `In a world of mass-produced dairy, true artisanal cheese stands apart. It is not simply a food product — it is a craft shaped by patience, science, and tradition.\n\nAt **Le Pondicherry Cheese**, every wheel, block, and pearl of cheese begins with a single principle: exceptional milk creates exceptional cheese.\n\nNestled in the coastal heritage region of Pondicherry, our cheese-making philosophy combines responsible dairy farming with refined European cheese traditions. The result is cheese that tells a story — from pasture to plate.`,
        relatedPosts: ["rise-of-artisanal", "craft-of-ageing"],
      },
      {
        id: "rise-of-artisanal",
        title: "The Rise of Artisanal Cheese in India: Why Quality Matters More Than Ever",
        date: "April 28, 2024",
        author: "Admin",
        category: "Heritage",
        image: "products/classic-brie.jpg",
        excerpt: "Over the past decade, India's culinary landscape has undergone a remarkable transformation. Consumers are discoverng the world of artisanal cheese...",
        tags: ["India", "Artisan", "Heritage", "Quality"],
        quote: { text: "The future of cheese in India will not be defined by mass production — but by craftsmanship, authenticity, and quality.", author: "Le Pondicherry Cheese" },
        content: `Over the past decade, India's culinary landscape has undergone a remarkable transformation. Restaurants, cafés, and home kitchens are increasingly embracing global flavours, and cheese has become one of the most exciting ingredients driving this shift.`,
        relatedPosts: ["farm-to-fromage", "craft-of-ageing"],
      },
      {
        id: "craft-of-ageing",
        title: "The Craft of Cheese Ageing: Why Time Creates Extraordinary Flavour",
        date: "April 15, 2024",
        author: "Admin",
        category: "Tradition",
        image: "products/baby-swiss-texture.png",
        excerpt: "In the world of fine cheese, time is more than a process — it is an ingredient. Aged cheeses reveal deeper character and complex flavour profiles...",
        tags: ["Ageing", "Affinage", "Flavour", "Artisan"],
        quote: { text: "Great cheese cannot be rushed. Every aged wheel tells a story of time, dedication, and artisanal excellence.", author: "Le Pondicherry Cheese" },
        content: `In the world of fine cheese, time is more than a process — it is an ingredient.\n\nWhile fresh cheeses delight with their milky softness, aged cheeses reveal deeper character, richer aromas, and complex flavour profiles that only patience can create.`,
        relatedPosts: ["farm-to-fromage", "chef-cheese-guide"],
      },
      {
        id: "chef-cheese-guide",
        title: "12 Types of Cheese Every Chef Should Know",
        date: "March 30, 2024",
        author: "Admin",
        category: "Lifestyle",
        image: "products/daddy-swiss-texture.png",
        excerpt: "Cheese is one of the most versatile ingredients in the culinary world. Understanding different cheese types is essential for building balanced menus...",
        tags: ["Guide", "Chefs", "Varieties", "Culinary"],
        quote: { text: "For chefs, cheese is more than an ingredient — it is a flavour enhancer, texture builder, and finishing touch that transforms good dishes into exceptional ones.", author: "Le Pondicherry Cheese" },
        content: `Cheese is one of the most versatile ingredients in the culinary world. From delicate fresh varieties to intensely aged classics, each cheese brings unique flavour, texture, and character to a dish.\n\nHere are **12 important cheeses every chef should know**:\n\n1. Mozzarella\n2. Bocconcini\n3. Ricotta\n4. Feta\n5. Halloumi\n6. Swiss Cheese\n7. PondyOrange\n8. Parmesan-Style Hard Cheese\n9. Burrata\n10. Paneer\n11. Low-Moisture Mozzarella\n12. Aged Swiss Varieties`,
        relatedPosts: ["mozzarella-vs-pizzaella", "perfect-cheese-board"],
      }
    ];

    // --- Process Products ---
    console.log(`📦 Seeding ${productsToSeed.length} products...`);
    for (const p of productsToSeed) {
      console.log(`🔹 Processing product: ${p.name}`);
      
      const imageUrls = [];
      if (p.images) {
        for (const imgPath of p.images) {
          const url = await migrateImage(imgPath);
          if (url) imageUrls.push(url);
        }
      } else if (p.image) {
        const url = await migrateImage(p.image);
        if (url) imageUrls.push(url);
      }

      await Product.create({
        ...p,
        slug: p.id,
        image: imageUrls.length > 0 ? imageUrls[0] : "",
        images: imageUrls,
        googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID
      });
    }

    // --- Process Blogs ---
    console.log(`📝 Seeding ${blogsToSeed.length} blogs...`);
    for (const b of blogsToSeed) {
      console.log(`🔹 Processing blog: ${b.title}`);
      
      const mainImageUrl = await migrateImage(b.image);
      const galleryUrls = [];
      if (b.gallery) {
        for (const imgPath of b.gallery) {
          const url = await migrateImage(imgPath);
          if (url) galleryUrls.push(url);
        }
      }

      await Blog.create({
        ...b,
        slug: b.id,
        image: mainImageUrl,
        gallery: galleryUrls
      });
    }

    console.log("✅ Database Seeding Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedData();
