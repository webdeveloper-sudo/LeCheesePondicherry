// SEO content from digital-marketing/seo.md. Schemas live in schemas.json
// (generated from digital-marketing/schema.md).
import schemas from "./schemas.json";

export const SITE_URL = "https://www.lepondicheese.com";
export const SITE_NAME = "Le Pondicherry Cheese";
export const SHOP_PATH = "/buy-cheese-online";

export interface PageSeo {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  path: string;
  schema?: object;
}

export interface ProductSeo extends PageSeo {
  seoSlug: string;
  productName: string;
  productDescription: string;
}

export const HOME_SEO: PageSeo = {
  title: "Premium Artisanal Cheese in India | Le Pondicherry Cheese",
  description:
    "Premium artisan cheese made with quality ingredients and rich flavours. One of the best cheese brands in India, bringing delicious taste to every meal.",
  keywords:
    "Best cheese brand in India, Best cheese company in India, Premium cheese brand, Artisanal cheese, Mozzarella cheese, Halloumi cheese",
  path: "/",
  schema: schemas.home,
};

export const SHOP_SEO: PageSeo = {
  title: "Buy Cheese Online | Le Pondicherry Cheese",
  description:
    "Buy cheese online at Le Pondicherry Cheese. Explore premium Mozzarella, Cheddar, Feta, Halloumi and more. Shop now!",
  keywords: "Buy best cheeses, shop premium cheese, Buy cheese online",
  path: SHOP_PATH,
  schema: schemas.shop,
};

// Keyed by the product slug stored in the database.
const PRODUCT_SEO: Record<string, Omit<ProductSeo, "path" | "schema">> = {
  pizzaella: {
    seoSlug: "buy-pizza-cheese",
    productName: "Pizzella Cheese",
    productDescription:
      "Pizzaella is a block-style mozzarella crafted for high-temperature cooking, delivering a controlled melt, delicious stretch, and minimal moisture release. Buy premium Pizza Cheese with rich flavour, perfect for homemade pizzas, restaurants, and professional kitchens. Check the pizza cheese price and shop today!",
    title: "Buy Pizza Cheese | Le Pondicherry Cheese",
    description:
      "Buy Pizza Cheese for rich flavour and a smooth melt. Check pizza cheese price and enjoy perfect cheese for homemade pizzas.",
    keywords:
      "pizzaella cheese, pizza cheese, buy pizza cheese online, Buy online pizza cheese in India, Pizza cheese price",
    ogTitle: "Buy Pizzaella cheese | Le Pondicherry Cheese",
  },
  feta: {
    seoSlug: "buy-fetta-cheese",
    productName: "Fetta Cheese",
    productDescription:
      "Buy premium Fetta Cheese, a brined Greek cheese with a crumbly texture and bold, salty flavour. Its slightly tangy, acidic profile adds brightness to salads, baked dishes, and gourmet recipes. Check the Fetta Cheese price and shop premium Feta Cheese online at Le Pondicherry Cheese to bring authentic Greek flavour to your table.",
    title: "Buy Fresh Fetta Cheese | Le Pondicherry Cheese",
    description:
      "Buy premium Feta Cheese online and enjoy its authentic Greek flavour, crumbly texture, and tangy taste. Check the Feta cheese price and order today!",
    keywords: "Fetta cheese, Fresh Fetta cheese, Buy Fetta cheese online, fetta cheese price",
    ogTitle: "Buy Fresh Fetta cheese Online | Le Pondicherry Cheese",
  },
  hallomi: {
    seoSlug: "buy-halloumi-cheese",
    productName: "Halloumi Cheese",
    productDescription:
      "Halloumi Cheese is a premium Cypriot cheese known for its firm, chewy texture and rich, savoury flavour. Ideal for grilling, frying, and baking, it develops a golden crust while maintaining its texture. Perfect for salads, wraps, sandwiches, and gourmet recipes, Le Pondicherry Cheese offers premium quality. Check the Halloumi Cheese price and shop online today!",
    title: "Buy Halloumi Cheese Online | Le Pondicherry Cheese",
    description:
      "Buy Halloumi Cheese from Le Pondicherry Cheese. Check the halloumi cheese price and enjoy its savoury taste, firm texture, and perfect grilling quality!",
    keywords:
      "Halloumi cheese, Buy halloumi cheese, Halloumi cheese price, Halloumi cheese online, Halloumi cheese in India, fresh halloumi cheese, Halloumi cheese buy online",
    ogTitle: "Buy Halloumi Cheese | Le Pondicherry Cheese",
  },
  ricotta: {
    seoSlug: "buy-ricotta-cheese",
    productName: "Ricotta Cheese",
    productDescription:
      "Ricotta is a premium fresh whey cheese from Le Pondicherry Cheese, known for its soft, creamy texture and sweet, milky flavour. Perfect for pasta, lasagna, desserts, and gourmet recipes. Check the Ricotta Cheese price and buy online today!",
    title: "Buy Fresh Ricotta Cheese | Le Pondicherry Cheese",
    description:
      "Buy Ricotta Cheese with a creamy texture and delicate milky sweetness. Check the ricotta cheese price and buy online for pasta, desserts, and more.",
    keywords:
      "Ricotta cheese, Ricotta cheese price, Ricotta cheese India, Ricotta cheese online, Low fat ricotta cheese, Buy ricotta cheese",
  },
  bocconcini: {
    seoSlug: "buy-bocconcini-cheese",
    productName: "Bocconcini Cheese",
    productDescription:
      "Bocconcini is a premium, bite-sized mozzarella cheese known for its soft, delicate texture, fresh milky flavour, and subtle tanginess. Perfect for salads, appetisers, pasta, pizzas, and gourmet dishes, it adds a creamy touch to every meal. Buy Bocconcini Cheese Online from Le Pondicherry Cheese and explore the Bocconcini cheese price. Order today and enjoy premium cheese delivered to your doorstep!",
    title: "Buy Bocconcini Cheese | Le Pondicherry Cheese",
    description:
      "Enjoy soft, bite-sized Bocconcini Cheese with a creamy texture and delicate milky flavour. Check the bocconcini cheese price and buy online today!",
    keywords:
      "Bocconcini Cheese, Bocconcini cheese price, Buy bocconcini cheese, Bocconcini cheese online, Bocconcini cheese ball",
  },
  mozzarella: {
    seoSlug: "buy-mozzarella-cheese",
    productName: "Mozzarella Cheese",
    productDescription:
      "Buy Fresh Mozzarella Cheese with a soft, moist texture, delicate milky flavour, subtle tang, and gentle salty undertone. Perfect for fresh salads, pizzas, pasta, and light cooking, this versatile cheese adds a creamy touch to your favourite dishes. Check the mozzarella cheese price and shop online today!",
    title: "Buy Mozzarella Cheese | Le Pondicherry Cheese",
    description:
      "Buy Mozzarella Cheese for its creamy taste and perfect melt. Check the mozzarella cheese price and order cheese for pizzas, pasta, and salads!",
    keywords:
      "Mozzarella cheese, Mozzarella cheese online, Buy mozzarella cheese, Mozzarella cheese price, Best mozzarella cheese in India, fresh mozzarella cheese",
  },
  burrata: {
    seoSlug: "buy-burrata-cheese",
    productName: "Burrata Cheese",
    productDescription:
      "Buy Burrata Cheese featuring a delicate outer shell and rich, creamy centre with a smooth texture and fresh, indulgent flavour. Perfect for salads, appetisers, pasta, and gourmet dishes, Burrata Cheese is best enjoyed fresh. Check the Burrata Cheese price online and elevate your dining experience with this premium cheese.",
    title: "Buy Fresh Burrata Cheese | Le Pondicherry Cheese",
    description:
      "Buy Burrata Cheese online for its delicate outer shell and creamy centre. Check the burrata cheese price and order today for a delicious gourmet treat!",
    keywords:
      "Burrata Cheese, Burrata cheese online, Buy burrata cheese, Burrata cheese price, Fresh burrata cheese, Burrata cheese India",
  },
  "grana-chery": {
    seoSlug: "buy-grana-parmesan-cheese",
    productName: "Grana Cherry Cheese",
    productDescription:
      "Grana Cherry Cheese from Le Pondicherry Cheese is a hard Parmesan-style cheese aged for nine months, offering a dense, crumbly texture and rich savoury umami flavour with delicate hints of toasted nuts. Winner of a Silver Award at the International Cheese & Dairy Awards 2024, this premium aged cheese is perfect for grating over pasta, risotto, salads, soups, and gourmet dishes. Shop Grana Cherry Cheese Online from Le Pondicherry Cheese for an award-winning cheese experience.",
    title: "Buy Grana Parmesan Cheese | Le Pondicherry Cheese",
    description:
      "Buy Grana Parmesan Cheese online for its rich, nutty flavour and firm texture. Check the Grana Parmesan Cheese price and order today!",
    keywords: "parmesan cheese, Grana parmesan cheese, Buy parmesan cheese online",
  },
  pondyorange: {
    seoSlug: "buy-cheddar-cheese",
    productName: "Pondy Orange Cheese",
    productDescription:
      "Pondy Orange is a semi-hard Cheddar-style cheese aged for around six months, developing a balanced tangy flavour and smooth texture. Perfect for slicing, melting, sandwiches, and everyday cooking, it adds rich flavour to your favourite dishes. Check the cheddar cheese price and buy online today!",
    title: "Buy Cheddar Cheese | Le Pondicherry Cheese",
    description:
      "Buy Cheddar Cheese for dishes that need a bold, rich flavour. Check the cheddar cheese price and order online today!",
    keywords: "Cheddar cheese, Buy cheddar cheese, Cheddar Cheese Price",
  },
  "daddy-swiss": {
    seoSlug: "buy-daddy-swiss-fondue-cheese",
    productName: "Daddy Swiss Cheese",
    productDescription:
      "Daddy Swiss is a premium Swiss-style cheese aged for five to six months, offering a rich buttery, nutty flavour and a firm, smooth texture. A Bronze Award Winner at the International Cheese & Dairy Awards 2024, it is perfect for sandwiches, cheese boards, gourmet recipes, and fondue. Check the fondue cheese price and enjoy premium quality from Le Pondicherry Cheese.",
    title: "Buy Daddy Swiss Fondue Cheese | Le Pondicherry Cheese",
    description:
      "Buy premium fondue cheese from Le Pondicherry Cheese. Check the fondue cheese price and shop online today for rich flavour and quality!",
    keywords:
      "Fondue cheese, daddy swiss cheese, Buy fondue cheese, fondue Cheese Price, sandwich cheese price, buy sandwich cheese",
  },
  "baby-swiss": {
    seoSlug: "buy-baby-swiss-cheese",
    productName: "Baby Swiss Cheese",
    productDescription:
      "Buy premium Baby Swiss Cheese from Le Pondicherry Cheese, aged for three months to deliver a mild nutty flavour, subtle tang, and smooth, creamy texture with distinctive small eyes. A Gold Award Winner at the International Cheese & Dairy Awards 2024, Check the Baby Swiss cheese price and enjoy its rich taste in sandwiches, burgers, cheese platters, and gourmet recipes. Perfect for everyday meals and special occasions. Order online today!",
    title: "Buy Baby Swiss Cheese | Le Pondicherry Cheese",
    description:
      "Buy Baby Swiss Cheese at Le Pondicherry Cheese. Check the Baby Swiss cheese price and enjoy its mild nutty flavour. Shop online today!",
    keywords: "swiss cheese, Buy baby swiss, Baby swiss Cheese Price, fondue cheese price",
  },
  paneer: {
    seoSlug: "buy-paneer-online",
    productName: "Paneer",
    productDescription:
      "Enjoy the rich taste and creamy texture of premium Paneer from Le Pondicherry Cheese. Made for freshness and quality, our paneer is perfect for preparing delicious paneer butter masala, tikka, curries, sandwiches, and everyday meals. Looking to Buy Paneer Online, Explore Le Pondicherry Cheese, check the latest paneer price, and bring home fresh, delicious cottage cheese. Order online today!",
    title: "Buy Paneer Online | Le Pondicherry Cheese",
    description:
      "Buy fresh Paneer Online from Le Pondicherry Cheese. Explore the best paneer price and enjoy rich taste, creamy texture, and premium quality!",
    keywords: "Buy paneer, Buy fresh paneer online, Paneer Price, Buy Paneer online",
  },
};

// Older slugs (static catalogue ids, chatbot links, previous URLs) -> DB slug.
const SLUG_ALIASES: Record<string, string> = {
  "pizzaella-cheese": "pizzaella",
  "feta-cheese": "feta",
  fetta: "feta",
  halloumi: "hallomi",
  "halloumi-cheese": "hallomi",
  "ricotta-cheese": "ricotta",
  "bocconcini-cheese": "bocconcini",
  "mozzarella-cheese": "mozzarella",
  "burrata-cheese": "burrata",
  "grana-chery-cheese": "grana-chery",
  "pondy-orange": "pondyorange",
  "pondy-orange-cheese": "pondyorange",
  "daddy-swiss-cheese": "daddy-swiss",
  "baby-swiss-cheese": "baby-swiss",
  "paneer-cheese": "paneer",
};

const SEO_SLUG_TO_DB_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(PRODUCT_SEO).map(([dbSlug, seo]) => [seo.seoSlug, dbSlug]),
);

// URL endpoints configured in the admin panel (stored as `urlSlug` on the product).
// Filled from API product lists via registerProductUrlSlugs; they override the SEO slug.
const CUSTOM_URL_SLUGS: Record<string, string> = {}; // DB slug -> URL slug
const CUSTOM_URL_TO_DB_SLUG: Record<string, string> = {}; // URL slug -> DB slug

export function registerProductUrlSlugs(products: { slug?: string; urlSlug?: string }[]) {
  for (const p of products || []) {
    if (!p?.slug) continue;
    const previous = CUSTOM_URL_SLUGS[p.slug];
    if (previous) delete CUSTOM_URL_TO_DB_SLUG[previous];
    if (p.urlSlug) {
      CUSTOM_URL_SLUGS[p.slug] = p.urlSlug;
      CUSTOM_URL_TO_DB_SLUG[p.urlSlug] = p.slug;
    } else {
      delete CUSTOM_URL_SLUGS[p.slug];
    }
  }
}

/** Lowercase, hyphen-separated URL endpoint: "Buy Fresh Paneer!" -> "buy-fresh-paneer". */
export function normalizeUrlSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Maps any URL slug (custom endpoint, SEO slug, DB slug or legacy alias) to the DB slug. */
export function resolveDbSlug(urlSlug: string): string {
  return (
    CUSTOM_URL_TO_DB_SLUG[urlSlug] || SEO_SLUG_TO_DB_SLUG[urlSlug] || SLUG_ALIASES[urlSlug] || urlSlug
  );
}

/** Default URL endpoint for a product when no custom one is configured. */
export function defaultUrlSlug(dbSlug: string): string {
  return PRODUCT_SEO[resolveDbSlug(dbSlug)]?.seoSlug || dbSlug;
}

/**
 * Every URL slug that already opens this product (SEO slug, DB slug, legacy aliases).
 * These stay reserved for it even after a custom endpoint is set, since old links still resolve.
 */
export function reservedUrlSlugs(dbSlug: string): string[] {
  const slugs = new Set<string>([dbSlug]);
  const seo = PRODUCT_SEO[dbSlug];
  if (seo) slugs.add(seo.seoSlug);
  for (const [alias, target] of Object.entries(SLUG_ALIASES)) {
    if (target === dbSlug) slugs.add(alias);
  }
  return [...slugs];
}

export function getProductSeo(slugOrId?: string | null): ProductSeo | null {
  if (!slugOrId) return null;
  const dbSlug = resolveDbSlug(slugOrId);
  const seo = PRODUCT_SEO[dbSlug];
  if (!seo) return null;
  return {
    ...seo,
    path: `/products/${CUSTOM_URL_SLUGS[dbSlug] || seo.seoSlug}`,
    schema: (schemas as Record<string, object>)[dbSlug],
  };
}

/** Every product page with SEO content (used for build-time prerendering). */
export function allProductSeo(): ProductSeo[] {
  return Object.keys(PRODUCT_SEO).map((dbSlug) => getProductSeo(dbSlug)!);
}

/** Old product URL slugs (DB slugs and aliases) -> SEO slug, for 301 redirects. */
export function legacyProductSlugs(): Record<string, string> {
  const legacy: Record<string, string> = {};
  for (const [dbSlug, seo] of Object.entries(PRODUCT_SEO)) legacy[dbSlug] = seo.seoSlug;
  for (const [alias, dbSlug] of Object.entries(SLUG_ALIASES)) legacy[alias] = PRODUCT_SEO[dbSlug].seoSlug;
  return legacy;
}

/** Public URL path for a product; falls back to its own slug/id. */
export function productPath(slugOrId: string): string {
  const seo = getProductSeo(slugOrId);
  return seo ? seo.path : `/products/${CUSTOM_URL_SLUGS[resolveDbSlug(slugOrId)] || slugOrId}`;
}

/** Display name from seo.md, falling back to the stored name. */
export function productDisplayName(slugOrId: string | undefined, fallback: string): string {
  return getProductSeo(slugOrId)?.productName || fallback;
}
