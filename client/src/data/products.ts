// Mock product data for Le Pondicherry Cheese
// This will be replaced with API data when backend is connected

// Import all product images
import babySwissPackage from "@/assets/images/products/baby-swiss-package.png";
import babySwissTexture from "@/assets/images/products/baby-swiss-texture.png";
import babySwissPairing from "@/assets/images/products/baby-swiss-pairing.png";
import daddySwissPackage from "@/assets/images/products/daddy-swiss-package.png";
import daddySwissTexture from "@/assets/images/products/daddy-swiss-texture.png";
import daddySwissPairing from "@/assets/images/products/daddy-swiss-pairing.png";
import pondyOrangePackage from "@/assets/images/products/pondy-orange-package.png";
import pondyOrangeTexture from "@/assets/images/products/pondy-orange-texture.png";
import pondyOrangePairing from "@/assets/images/products/pondy-orange-pairing.png";
import granaCherryPackage from "@/assets/images/products/grana-chery-package.png";
import granaCherryTexture from "@/assets/images/products/grana-chery-texture.png";
import granaCherryPairing from "@/assets/images/products/grana-chery-pairing.png";
import burrataPackage from "@/assets/images/products/burrata-package.png";
import mozzarellaPackage from "@/assets/images/products/mozzarella-package.png";
import mozzarellaTexture from "@/assets/images/products/mozzarella-texture.png";
import bocconciniPackage from "@/assets/images/products/bocconcini-package.png";
import ricottaPackage from "@/assets/images/products/ricotta-package.png";
import halloumiPackage from "@/assets/images/products/halloumi-package.png";
import fetaPackage from "@/assets/images/products/feta-package.png";
import pizzaellaPackage from "@/assets/images/products/pizzaella-package.png";
import cottageCheesePackage from "@/assets/images/products/cottage-cheese-package.png";
// import skyrPackage from "@/assets/images/products/skyr-package.png";
import agedCheddar from "@/assets/images/products/aged-cheddar.jpg";
import classicBrie from "@/assets/images/products/classic-brie.jpg";
import kombuchaRind from "@/assets/images/products/kombucha-rind.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  weight: string;
  inStock: boolean;
  featured?: boolean;
  tastingNotes?: {
    appearance: string;
    texture: string;
    aroma: string;
    flavor: string;
    finish: string;
  };
  pairings?: string[];
  ingredients?: string;
}

export const products: Product[] = [
  {
    id: "baby-swiss",
    name: "Baby Swiss",
    shortDescription: "Mild & Gently Sweet",
    description:
      "Baby Swiss is aged for three months, resulting in a mild flavour and smooth texture with small eyes.",
    price: 420,
    originalPrice: 550,
    image: babySwissPackage,
    images: [babySwissPackage, babySwissTexture, babySwissPairing],
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
    description:
      "Daddy Swiss is aged for five to six months, giving it deeper flavour and firmer structure compared to Baby Swiss.",
    price: 450,
    originalPrice: 600,
    image: daddySwissPackage,
    images: [daddySwissPackage, daddySwissTexture, daddySwissPairing],
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
  // Cheddar (Aged 6 Months)
  {
    id: "cheddar",
    name: "Cheddar",
    shortDescription: "Smooth, Mature & Versatile",
    description:
      "Cheddar is a semi-hard cheese aged for around six months to develop balanced flavour and smooth texture. Suitable for slicing, melting, and everyday cooking.",
    price: 420,
    originalPrice: 560,
    image: pondyOrangePackage,
    images: [pondyOrangePackage, pondyOrangeTexture, pondyOrangePairing],
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
    description:
      "Grana Cherry is a hard, parmesan-style cheese aged for nine months. Aging develops a dense texture and concentrated flavour suited for finishing dishes.",
    price: 450,
    originalPrice: 590,
    image: granaCherryPackage,
    images: [granaCherryPackage, granaCherryTexture, granaCherryPairing],
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
    description:
      "Burrata features a delicate outer shell filled with a rich, creamy centre. It is best consumed fresh and served simply to appreciate its texture and flavour.",
    price: 175,
    originalPrice: 240,
    image: burrataPackage,
    images: [burrataPackage],
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
    description:
      "Fresh mozzarella is a soft, moist cheese with a clean, milky flavour. It melts gently and is suited for fresh preparations as well as light cooking. Best enjoyed where texture and freshness are important.",
    price: 300,
    originalPrice: 390,
    image: mozzarellaPackage,
    images: [mozzarellaPackage, mozzarellaTexture],
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
    description:
      "Bocconcini are small mozzarella balls with a soft texture and mild dairy flavour. Easy to portion and versatile in both fresh and lightly cooked dishes.",
    price: 300,
    originalPrice: 410,
    image: bocconciniPackage,
    images: [bocconciniPackage],
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
    description:
      "Ricotta is a fresh cheese made from whey, giving it a lighter texture than milk-based cheeses. It works well in both savoury and sweet dishes.",
    price: 275,
    originalPrice: 370,
    image: ricottaPackage,
    images: [ricottaPackage],
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
    description:
      "Halloumi is a heat-stable cheese made for high-temperature cooking. It softens when heated but does not melt, forming a golden crust when grilled or pan-fried. Its firm texture and clean flavour make it ideal for hot dishes.",
    price: 360,
    originalPrice: 480,
    image: halloumiPackage,
    images: [halloumiPackage],
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
    description:
      "Feta is a brined cheese with a crumbly texture and balanced saltiness. It adds brightness and contrast to salads and baked dishes.",
    price: 360,
    originalPrice: 490,
    image: fetaPackage,
    images: [fetaPackage],
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
    description:
      "Pizzaella is a block-style mozzarella developed for high-temperature applications. It delivers controlled melt and stretch with minimal moisture release, making it suitable for pizzas and baked dishes.",
    price: 275,
    originalPrice: 360,
    image: pizzaellaPackage,
    images: [pizzaellaPackage],
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
    description:
      "Paneer is a fresh, heat-stable cheese widely used in Indian cooking. It holds its shape during frying and gravies while absorbing flavours well.",
    price: 110,
    originalPrice: 150,
    image: cottageCheesePackage,
    images: [cottageCheesePackage],
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
    description:
      "Skyr is a thick, cultured dairy product made using traditional fermentation methods. It has a smooth, dense texture with a mild tang and is commonly consumed fresh as a spoonable dairy product.",
    price: 250,
    originalPrice: 340,
    image: ricottaPackage,
    images: [ricottaPackage],
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
  // COMMENTED OUT - NOT IN CURRENT PRODUCT LIST
  // Subscription Plans
  // {
  //     id: 'sub-explorer',
  //     name: 'Cheese Club Explorer',
  //     shortDescription: '3 artisan cheeses monthly',
  //     description: 'Start your artisan cheese journey with our Explorer plan. Receive 3 carefully curated cheeses each month, including tasting notes and pairing suggestions.',
  //     price: 1200,
  //     image: '/images/products/subscription-explorer.png',
  //     category: 'subscriptions',
  //     rating: 5,
  //     reviews: 89,
  //     weight: 'Subscription',
  //     inStock: true,
  // },
  // {
  //     id: 'sub-enthusiast',
  //     name: 'Cheese Club Enthusiast',
  //     shortDescription: '4 premium cheeses monthly',
  //     description: 'Elevate your cheese experience with our Enthusiast plan. Get 4 premium artisan cheeses each month with exclusive access to limited editions.',
  //     price: 1800,
  //     image: '/images/products/subscription-enthusiast.png',
  //     category: 'subscriptions',
  //     rating: 5,
  //     reviews: 124,
  //     weight: 'Subscription',
  //     inStock: true,
  //     featured: true,
  // },
  // {
  //     id: 'sub-connoisseur',
  //     name: 'Cheese Club Connoisseur',
  //     shortDescription: '5 rare artisan cheeses monthly',
  //     description: 'The ultimate cheese experience. Receive 5 rare and aged artisan cheeses each month, including our most exclusive selections and aged varieties.',
  //     price: 2500,
  //     image: '/images/products/subscription-connoisseur.png',
  //     category: 'subscriptions',
  //     rating: 5,
  //     reviews: 76,
  //     weight: 'Subscription',
  //     inStock: true,
  // },
];

export const featuredProducts = products.filter((p) => p.featured);

export const categories = [
  { id: "all", name: "All Cheeses" },
  { id: "aged", name: "Aged Cheeses" },
  { id: "fresh", name: "Fresh Cheeses" },
  { id: "specialty", name: "Specialty Cheeses" },
  { id: "melting", name: "Melting & Basics" },
];

export const testimonials = [
  {
    id: 1,
    quote:
      "The Baby Swiss is a revelation! Finally, authentic artisan flavor available locally in Pondicherry.",
    author: "Chef Ravi Menon",
    location: "Bangalore",
    rating: 5,
  },
  {
    id: 2,
    quote:
      "Grana Chéry has become a staple in my kitchen. The umami depth is incredible.",
    author: "Priya Sharma",
    location: "Mumbai",
    rating: 5,
  },
  {
    id: 3,
    quote:
      "I've visited their shop in Pondy, and the quality is consistent every single time. Best Mozzarella in India!",
    author: "David Laurent",
    location: "Pondicherry",
    rating: 5,
  },
];
