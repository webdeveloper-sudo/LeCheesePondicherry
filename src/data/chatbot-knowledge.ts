export interface ChatKnowledge {
    keywords: string[];
    answer: string;
    suggestions: string[];
    category: 'shipping' | 'products' | 'orders' | 'wholesale' | 'brand' | 'other';
}

const rawData = [
    // PRODUCT-SPECIFIC QUERIES - All 12 Real Products
    ["baby swiss, baby cheese, swiss cheese, fondue cheese", "Baby Swiss (₹320/200g) - toasted bread & fondue cheese aged 2 months. Mild, nutty flavor perfect for melting! [View Product](/products/baby-swiss)", "Daddy Swiss, Aged Cheeses, Shop All", "products"],
    ["daddy swiss, aged swiss, mature swiss", "Daddy Swiss (₹350/200g) - the king of Swiss aged 4 months with deeper nutty profile. [View Product](/products/daddy-swiss)", "Baby Swiss, Grana Chéry, Aged Selection", "products"],
    ["pondy orange, cheddar, orange cheese, aged cheddar", "Pondy Orange (₹320/200g) - vibrant aged cheddar style, sharp and savory. [View Product](/products/pondy-orange)", "Baby Swiss, Grana Chéry, Shop All", "products"],
    ["grana chery, parmesan, grating cheese, hard cheese, umami", "Grana Chéry (₹350/200g) - aged 9 months, our umami powerhouse with crystalline texture. [View Product](/products/grana-chery)", "Pondy Orange, Aged Cheeses, Premium", "products"],
    ["burrata, creamy cheese, fresh cheese", "Burrata (₹300/200g) - the queen of fresh cheeses with decadent creamy center. [View Product](/products/burrata)", "Mozzarella, Fresh Cheeses, Bocconcini", "products"],
    ["mozzarella, pizza cheese, fresh mozzarella", "Mozzarella (₹225/200g) - handmade fresh with milky flavor, perfect for pizza! [View Product](/products/mozzarella)", "Pizzaella, Burrata, Fresh Range", "products"],
    ["bocconcini, mozzarella balls, salad cheese", "Bocconcini (₹60/50g) - bite-sized mozzarella pearls for salads. [View Product](/products/bocconcini)", "Mozzarella, Burrata, Fresh", "products"],
    ["ricotta, dessert cheese, baking cheese", "Ricotta (₹225/200g) - light & fluffy for pasta and desserts. [View Product](/products/ricotta)", "Bocconcini, Fresh Range, Shop All", "products"],
    ["halloumi, grilling cheese, fry cheese", "Halloumi (₹300/200g) - perfect for grilling with high melting point! [View Product](/products/halloumi)", "Feta, Specialty Cheeses, Shop All", "products"],
    ["feta, salad cheese, greek cheese", "Feta (₹275/200g) - tangy & crumbly Mediterranean staple. [View Product](/products/feta)", "Halloumi, Specialty, Fresh", "products"],
    ["pizzaella, low moisture mozzarella, melting", "Pizzaella (₹225/200g) - crafted for perfect pizza melt! [View Product](/products/pizzaella)", "Mozzarella, Cottage Cheese, Melting", "products"],
    ["cottage cheese, soft cheese, salad cheese", "Cottage Cheese (₹110/200g) - fresh artisan cottage cheese for salads and healthy snacks. [View Product](/products/cottage-cheese)", "Halloumi, Fresh, Shop All", "products"],

    // TOP PICKS & PRICING
    ["top products, bestseller, popular, recommendation", "Top picks: Baby Swiss (₹320), Grana Chéry (₹350), Burrata (₹300). [Shop All](/shop)", "Subscription Plans, Gift Sets, View All", "products"],
    ["price, cost, how much, pricing", "Range: ₹60 (Bocconcini 50g) to ₹350 (Grana Chéry/Daddy Swiss 200g). [View All](/shop)", "Top Products, Subscription, Gifts", "products"],
    ["subscription, monthly cheese, cheese club", "Cheese Club: Explorer (₹1,200/month - 3 cheeses), Enthusiast (₹1,800/month - 4 cheeses), Connoisseur (₹2,500/month - 5 cheeses). [View Plans](/shop)", "Top Products, Shop All", "products"],

    // BRAND & STORY
    ["our story, brand, heritage, about", "French artisanal traditions meet fresh Pondicherry milk. [Full Story](/about)", "Achariya Group, Process, Visit Us", "brand"],
    ["achariya group, agoc", "Achariya Group: Education, Tech & premium Food. [Learn More](https://achariya.in)", "Our Story, Food Park, Tech Head", "brand"],

    // SHIPPING & ORDERS
    ["shipping, delivery, cost", "Pan-India cold-chain: ₹99 (Free over ₹1500). [Policy](/shipping)", "Track Order, Pincode, Express", "shipping"],
    ["track order, status", "Check email for tracking link or [Contact Us](/contact)", "Shipping Info, Refund, Help", "shipping"],

    // HELP
    ["contact, email, phone", "hello@lepondycheese.com | [Contact Page](/contact)", "Wholesale, Story, Visit Us", "other"],
    ["thanks, thank you, goodbye, bye", "You're welcome! Come back anytime for cheese assistance!", "Shop Now, Story, Top Products", "other"],
    ["hello, hi, namaste", "Namaste! Your Le Pondy Cheese assistant here. Check [Products](/shop)!", "Top Products, Shipping, Story", "other"]
];

export const CHAT_KNOWLEDGE: ChatKnowledge[] = rawData.map(item => ({
    keywords: item[0].split(',').map(k => k.trim().toLowerCase()),
    answer: item[1],
    suggestions: item[2].split(',').map(s => s.trim()),
    category: item[3] as any
}));

export const findBestMatch = (query: string): ChatKnowledge | null => {
    const q = query.toLowerCase().trim();
    if (!q) return null;

    // 1. Exact Match Priority
    const exactMatch = CHAT_KNOWLEDGE.find(entry =>
        entry.keywords.some(kw => kw === q)
    );
    if (exactMatch) return exactMatch;

    // 2. Guardrail Check
    const educationalKeywords = ['school', 'admission', 'student', 'result', 'exam', 'class', 'teacher', 'lms'];
    if (educationalKeywords.some(k => q.includes(k))) {
        return CHAT_KNOWLEDGE.find(k => k.category === 'other' && k.keywords.includes('education')) || null;
    }

    // 3. Score-based matching
    let bestMatch: ChatKnowledge | null = null;
    let maxScore = 0;
    for (const entry of CHAT_KNOWLEDGE) {
        let score = 0;
        for (const kw of entry.keywords) {
            if (q === kw) score += 100;
            if (q.includes(kw)) score += kw.length;
            if (kw.includes(q)) score += q.length;
        }
        if (score > maxScore) {
            maxScore = score;
            bestMatch = entry;
        }
    }
    return maxScore > 3 ? bestMatch : null;
};
