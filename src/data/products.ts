// Mock product data for Le Pondicherry Cheese
// This will be replaced with API data when backend is connected

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
        id: 'baby-swiss',
        name: 'Baby Swiss',
        shortDescription: 'Toasted Bread & Fondue Cheese - Aged 2 Months',
        description: 'A Swiss-styled masterpiece, aged for 2 months to develop a mild, nutty flavor with a subtle tang. Perfect for melting, its characteristic small eyes and smooth texture make it a gourmet favorite.',
        price: 320,
        originalPrice: 500,
        image: '/images/products/baby-swiss-package.png',
        images: [
            '/images/products/baby-swiss-package.png',
            '/images/products/baby-swiss-texture.png',
            '/images/products/baby-swiss-pairing.png'
        ],
        category: 'aged',
        rating: 5,
        reviews: 45,
        weight: '200g',
        inStock: true,
        featured: true,
        tastingNotes: {
            appearance: 'Pale yellow with small, uniform eyes',
            texture: 'Semi-hard, smooth, and supple',
            aroma: 'Mild, sweet, and nutty',
            flavor: 'Buttery with a slight lactic tang',
            finish: 'Clean and mellow',
        },
        pairings: ['Chardonnay', 'Toasted Sourdough', 'Fresh Grapes', 'Walnuts'],
        ingredients: 'A2 Cow Milk, Culture, Vegetarian Rennet, Salt',
    },
    {
        id: 'daddy-swiss',
        name: 'Daddy Swiss',
        shortDescription: 'The King of Swiss - Aged 4 Months',
        description: 'A bolder, more matured version of our Swiss style. Aged for 4 months, Daddy Swiss develops larger eyes and a significantly deeper nutty profile with a sophisticated finish.',
        price: 350,
        originalPrice: 500,
        image: '/images/products/daddy-swiss-package.png',
        images: [
            '/images/products/daddy-swiss-package.png',
            '/images/products/daddy-swiss-texture.png',
            '/images/products/daddy-swiss-pairing.png'
        ],
        category: 'aged',
        rating: 5,
        reviews: 32,
        weight: '200g',
        inStock: true,
        featured: true,
        tastingNotes: {
            appearance: 'Deep yellow with large, sporadic eyes',
            texture: 'Firm, dense, and rich',
            aroma: 'Pronounced nutty and earthy notes',
            flavor: 'Intense, savory, and complex nuttiness',
            finish: 'Long and buttery',
        },
        pairings: ['Pinot Noir', 'Dried Figs', 'Rye Bread', 'Dark Chocolate'],
        ingredients: 'A2 Cow Milk, Culture, Vegetarian Rennet, Salt',
    },
    {
        id: 'pondy-orange',
        name: 'Pondy Orange',
        shortDescription: 'Vibrant & Sharp Aged Cheddar Style',
        description: 'Our take on the classic aged cheddar. Vibrant in color and sharp in flavor, this cheese is aged to perfection to achieve a complex, savory profile that stands out on any platter.',
        price: 320,
        originalPrice: 500,
        image: '/images/products/pondy-orange-package.png',
        images: [
            '/images/products/pondy-orange-package.png',
            '/images/products/pondy-orange-texture.png',
            '/images/products/pondy-orange-pairing.png'
        ],
        category: 'aged',
        rating: 4,
        reviews: 28,
        weight: '200g',
        inStock: true,
        featured: true,
        tastingNotes: {
            appearance: 'Bright orange, smooth and consistent',
            texture: 'Firm, slightly crumbly with age',
            aroma: 'Sharp and savory',
            flavor: 'Intense, tangy, with complex umami',
            finish: 'Persistent and sharp',
        },
        pairings: ['India Pale Ale (IPA)', 'Crisp Apples', 'Caramelized Onions', 'Oat Biscuits'],
        ingredients: 'A2 Cow Milk, Annatto (Natural Color), Culture, Vegetarian Rennet, Salt',
    },
    {
        id: 'grana-chery',
        name: 'Grana Chéry',
        shortDescription: 'Aged 9 Months - The Umami Powerhouse',
        description: 'A hard, granular cheese inspired by the Italian Grana tradition. Aged for 9 months, it develops a crystalline texture and an explosion of savory umami flavors.',
        price: 350,
        originalPrice: 500,
        image: '/images/products/grana-chery-package.png',
        images: [
            '/images/products/grana-chery-package.png',
            '/images/products/grana-chery-texture.png',
            '/images/products/grana-chery-pairing.png'
        ],
        category: 'aged',
        rating: 5,
        reviews: 51,
        weight: '200g',
        inStock: true,
        featured: true,
        tastingNotes: {
            appearance: 'Straw-colored with a hard, slightly oily rind',
            texture: 'Hard, granular, and crystalline',
            aroma: 'Deep, fruity, and intoxicatingly savory',
            flavor: 'Rich, salty, and packed with umami protein crystals',
            finish: 'Long, complex, and satisfying',
        },
        pairings: ['Sangiovese', 'Balsamic Vinegar', 'Prosciutto', 'Pears'],
        ingredients: 'A2 Cow Milk, Culture, Vegetarian Rennet, Salt',
    },
    {
        id: 'burrata',
        name: 'Burrata',
        shortDescription: 'The Queen of Fresh Cheeses - Creamy Center',
        description: 'A delicate pouch of fresh mozzarella that hides a decadent heart of stracciatella and cream. When broken, its creamy center flows out, creating a luxurious culinary experience that defines artisan indulgence.',
        price: 300,
        originalPrice: 350,
        image: '/images/products/burrata-package.png',
        images: [
            '/images/products/burrata-package.png'
        ],
        category: 'fresh',
        rating: 5,
        reviews: 64,
        weight: '200g',
        inStock: true,
        featured: true,
        tastingNotes: {
            appearance: 'Snow white pouch, plump and moist',
            texture: 'Soft exterior with an oozing, creamy interior',
            aroma: 'Fresh milk and sweet cream',
            flavor: 'Incredibly buttery and mildly sweet',
            finish: 'Silky and clean',
        },
        pairings: ['Prosecco', 'Heirloom Tomatoes', 'Truffle Oil', 'Basil Pesto'],
        ingredients: 'Fresh Cow Milk, Cream, Culture, Vegetarian Rennet, Salt',
    },
    {
        id: 'mozzarella',
        name: 'Mozzarella',
        shortDescription: 'Fresh, Milky & Elastic - Handmade Specialty',
        description: 'Authentic handmade mozzarella balls stored in fresh brine. Known for its distinctively milky flavor and satisfying elastic texture, it is the cornerstone of Mediterranean cuisine.',
        price: 225,
        originalPrice: 250,
        image: '/images/products/mozzarella-package.png',
        images: [
            '/images/products/mozzarella-package.png',
            '/images/products/mozzarella-texture.png'
        ],
        category: 'fresh',
        rating: 5,
        reviews: 48,
        weight: '200g',
        inStock: true,
        featured: true,
        tastingNotes: {
            appearance: 'Pearly white balls',
            texture: 'Supple, elastic, and stringy',
            aroma: 'Freshly milked cream',
            flavor: 'Mildly sweet and delicately lactic',
            finish: 'Refreshing and milky',
        },
        pairings: ['Sauvignon Blanc', 'Fresh Basil', 'Cherry Tomatoes', 'Extra Virgin Olive Oil'],
        ingredients: 'Fresh Cow Milk, Culture, Vegetarian Rennet, Salt',
    },
    {
        id: 'bocconcini',
        name: 'Bocconcini',
        shortDescription: 'Bite-sized Mozzarella Pearls',
        description: 'Adorable, bite-sized "little mouthfuls" of fresh mozzarella. Perfect for salads, skewers, or snacking, these pearls carry the same premium quality as our whole mozzarella. Each pearl is a burst of fresh, milky goodness.',
        price: 60,
        originalPrice: 100,
        image: '/images/products/bocconcini-package.png',
        images: [
            '/images/products/bocconcini-package.png'
        ],
        category: 'fresh',
        rating: 4,
        reviews: 22,
        weight: '50g',
        inStock: true,
        tastingNotes: {
            appearance: 'Smooth, white pearls in brine',
            texture: 'Soft, springy, and juicy',
            aroma: 'Subtle fresh milk',
            flavor: 'Clean, milky, and mildly sweet',
            finish: 'Light and refreshing',
        },
        pairings: ['Cherry Tomatoes', 'Fresh Basil', 'Balsamic Glaze'],
        ingredients: 'Fresh Cow Milk, Culture, Vegetarian Rennet, Salt',
    },
    {
        id: 'ricotta',
        name: 'Ricotta',
        shortDescription: 'Light, Fluffy & Sweet - The Baker\'s Delight',
        description: 'A fresh, creamy curd cheese with a light and airy texture. Naturally sweet and low in fat, our Ricotta is versatile enough for both savory pasta dishes and decadent desserts.',
        price: 225,
        originalPrice: 250,
        image: '/images/products/ricotta-package.png',
        images: [
            '/images/products/ricotta-package.png'
        ],
        category: 'fresh',
        rating: 5,
        reviews: 36,
        weight: '200g',
        inStock: true,
        tastingNotes: {
            appearance: 'Pure white, fine curd',
            texture: 'Light, fluffy, and slightly grainy',
            aroma: 'Sweet milk',
            flavor: 'Delicate, creamy, and mildly sweet',
            finish: 'Clean and fresh',
        },
        pairings: ['Honey', 'Fresh Berries', 'Spinach', 'Lemon Zest'],
        ingredients: 'Cow Milk Whey/Milk, Culture, Salt',
    },
    {
        id: 'halloumi',
        name: 'Halloumi',
        shortDescription: 'The Grilling Cheese - High Melting Point',
        description: 'Our signature Grilling Cheese. Known for its incredibly high melting point, Halloumi can be pan-seared or grilled until golden brown, resulting in a savory, "squeaky" delight that is incomparable when warm.',
        price: 300,
        originalPrice: 350,
        image: '/images/products/halloumi-package.png',
        images: [
            '/images/products/halloumi-package.png'
        ],
        category: 'specialty',
        rating: 5,
        reviews: 42,
        weight: '200g',
        inStock: true,
        featured: true,
        tastingNotes: {
            appearance: 'Off-white rectangular block',
            texture: 'Firm and "squeaky" when bitten',
            aroma: 'Mildly salty and herbal',
            flavor: 'Salty, savory, and rich when heated',
            finish: 'Tangy and satisfying',
        },
        pairings: ['Rosé Wine', 'Watermelon', 'Mint Leaves', 'Pomegranate Molasses'],
        ingredients: 'Cow Milk, Culture, Vegetarian Rennet, Salt, Dried Mint',
    },
    {
        id: 'feta',
        name: 'Feta',
        shortDescription: 'Tangy & Crumbly - A Mediterranean Staple',
        description: 'A classic white brined cheese with a characteristic tangy flavor and crumbly texture. Perfect for Greek salads, pastries, or as a salty accent to roasted vegetables. Our Feta is aged in brine to peak maturity.',
        price: 275,
        originalPrice: 320,
        image: '/images/products/feta-package.png',
        images: [
            '/images/products/feta-package.png'
        ],
        category: 'specialty',
        rating: 4,
        reviews: 31,
        weight: '200g',
        inStock: true,
        tastingNotes: {
            appearance: 'Pure white block, slightly pitted',
            texture: 'Crumbly and moist',
            aroma: 'Tangy and briny',
            flavor: 'Sharp, salty, and acidic',
            finish: 'Zesty and lingering',
        },
        pairings: ['Assyrtiko', 'Kalamata Olives', 'Cucumber', 'Oregano'],
        ingredients: 'Cow Milk, Brine, Culture, Vegetarian Rennet, Salt',
    },
    {
        id: 'pizzaella',
        name: 'Pizzaella',
        shortDescription: 'The Ultimate Melting Mozzarella',
        description: 'Specially crafted for the perfect melt. Our Pizzaella is a low-moisture mozzarella designed to bubble and brown beautifully over pizzas, lasagnas, and gratins. It provides the iconic stretch that every cheese lover craves.',
        price: 225,
        originalPrice: 300,
        image: '/images/products/pizzaella-package.png',
        images: [
            '/images/products/pizzaella-package.png'
        ],
        category: 'melting',
        rating: 5,
        reviews: 55,
        weight: '200g',
        inStock: true,
        tastingNotes: {
            appearance: 'Creamy white, firm block',
            texture: 'Elastic and smooth when melted',
            aroma: 'Buttery and savory',
            flavor: 'Mildly salty and rich',
            finish: 'Satisfyingly savory',
        },
        pairings: ['Sourdough Pizza Crust', 'Pepperoni', 'Fresh Oregano', 'Chili Flakes'],
        ingredients: 'Cow Milk, Culture, Vegetarian Rennet, Salt',
    },
    {
        id: 'cottage-cheese',
        name: 'Cottage Cheese',
        shortDescription: 'Soft & Crumbly Salad Cheese',
        description: 'Natural, handmade artisanal cottage cheese made from cow milk. Fresh cheese with soft and crumbly texture, perfect for salads, dips, and healthy snacking. Indian specialty cheese made with traditional methods.',
        price: 110,
        originalPrice: 120,
        image: '/images/products/cottage-cheese-package.png',
        images: [
            '/images/products/cottage-cheese-package.png'
        ],
        category: 'fresh',
        rating: 5,
        reviews: 89,
        weight: '200g',
        inStock: true,
        tastingNotes: {
            appearance: 'Bright white, soft curds',
            texture: 'Soft, crumbly, and creamy',
            aroma: 'Fresh and milky',
            flavor: 'Mild, sweet, and clean',
            finish: 'Refreshing and light',
        },
        pairings: ['Fresh Salads', 'Fruit Bowls', 'Toast', 'Smoothies'],
        ingredients: 'Cow Milk, Culture, Salt',
    },
    // Subscription Plans
    {
        id: 'sub-explorer',
        name: 'Cheese Club Explorer',
        shortDescription: '3 artisan cheeses monthly',
        description: 'Start your artisan cheese journey with our Explorer plan. Receive 3 carefully curated cheeses each month, including tasting notes and pairing suggestions.',
        price: 1200,
        image: '/images/products/subscription-explorer.png',
        category: 'subscriptions',
        rating: 5,
        reviews: 89,
        weight: 'Subscription',
        inStock: true,
    },
    {
        id: 'sub-enthusiast',
        name: 'Cheese Club Enthusiast',
        shortDescription: '4 premium cheeses monthly',
        description: 'Elevate your cheese experience with our Enthusiast plan. Get 4 premium artisan cheeses each month with exclusive access to limited editions.',
        price: 1800,
        image: '/images/products/subscription-enthusiast.png',
        category: 'subscriptions',
        rating: 5,
        reviews: 124,
        weight: 'Subscription',
        inStock: true,
        featured: true,
    },
    {
        id: 'sub-connoisseur',
        name: 'Cheese Club Connoisseur',
        shortDescription: '5 rare artisan cheeses monthly',
        description: 'The ultimate cheese experience. Receive 5 rare and aged artisan cheeses each month, including our most exclusive selections and aged varieties.',
        price: 2500,
        image: '/images/products/subscription-connoisseur.png',
        category: 'subscriptions',
        rating: 5,
        reviews: 76,
        weight: 'Subscription',
        inStock: true,
    },
];

export const featuredProducts = products.filter(p => p.featured);

export const categories = [
    { id: 'all', name: 'All Cheeses' },
    { id: 'aged', name: 'Aged Cheeses' },
    { id: 'fresh', name: 'Fresh Cheeses' },
    { id: 'specialty', name: 'Specialty Cheeses' },
    { id: 'melting', name: 'Melting & Basics' },
];

export const testimonials = [
    {
        id: 1,
        quote: "The Baby Swiss is a revelation! Finally, authentic artisan flavor available locally in Pondicherry.",
        author: "Chef Ravi Menon",
        location: "Bangalore",
        rating: 5,
    },
    {
        id: 2,
        quote: "Grana Chéry has become a staple in my kitchen. The umami depth is incredible.",
        author: "Priya Sharma",
        location: "Mumbai",
        rating: 5,
    },
    {
        id: 3,
        quote: "I've visited their shop in Pondy, and the quality is consistent every single time. Best Mozzarella in India!",
        author: "David Laurent",
        location: "Pondicherry",
        rating: 5,
    },
];

