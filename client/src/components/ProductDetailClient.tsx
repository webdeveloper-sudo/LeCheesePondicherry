"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useUserStore } from "@/store/useUserStore";
import { useToastStore } from "@/store/useToastStore";
import { BookOpenText, CookingPot, Heart, UtensilsCrossed, X } from "lucide-react";
import ProductCard from "./ProductCard";

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, trackProductView } = useUserStore();
  const { addToast } = useToastStore();

  const [quantity, setQuantity] = useState(1);
  // Always default to "200g" — the base price weight.
  // product.weight from DB may be a non-standard value so we ignore it.
  const [selectedWeight, setSelectedWeight] = useState("200g");
  const [activeTab, setActiveTab] = useState("description");
  const [addedToCart, setAddedToCart] = useState(false);
  const [mainImage, setMainImage] = useState(product.image);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [selectedDish, setSelectedDish] = useState<any>(null);

  const inWishlist = isInWishlist(product.id);

  // Sync state when product changes (for similar items navigation)
  useEffect(() => {
    setMainImage(product.image);
    setQuantity(1);
    setSelectedWeight("200g"); // Always reset to 200g base price on product change
    setAddedToCart(false);
    setActiveTab("description");
  }, [product.id, product.image]);

  // Track product view when component mounts
  useEffect(() => {
    trackProductView(product.id);
  }, [product.id, trackProductView]);

  const weightOptions = [
    { label: "200g", price: product.price },
    { label: "400g", price: Math.round(product.price * 1.85) },
    { label: "600g", price: Math.round(product.price * 2.65) },
    { label: "800g", price: Math.round(product.price * 3.4) },
    { label: "1kg", price: Math.round(product.price * 4.1) },
  ];

  const selectedPrice =
    weightOptions.find((w) => w.label === selectedWeight)?.price ||
    product.price;

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedWeight, selectedPrice);
    addToast(`${quantity}x ${product.name} added to cart!`, "success", {
      label: "View Cart",
      href: "/cart",
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity, selectedWeight, selectedPrice);
    navigate("/checkout");
  };

  const handleWishlistToggle = async () => {
    if (isTogglingWishlist) return;
    setIsTogglingWishlist(true);
    try {
      await toggleWishlist(product.id);
      if (inWishlist) {
        addToast(`${product.name} removed from wishlist`, "info");
      } else {
        addToast(`${product.name} added to wishlist!`, "success", {
          label: "View Wishlist",
          href: "/wishlist",
        });
      }
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="bg-bg-cream-light py-4">
        <div className="container mx-auto px-4">
          <ol className="flex flex-wrap items-center text-sm text-text-secondary">
            <li>
              <Link to="/" className="hover:text-brand-gold-subtle">
                Home
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link to="/shop" className="hover:text-brand-gold-subtle">
                Shop
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-text-primary">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative">
              <div className="aspect-square bg-bg-cream-light rounded-lg overflow-hidden relative">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {/* Wishlist button on image */}
                <button
                  onClick={handleWishlistToggle}
                  className={`absolute top-4 right-4 p-3 rounded-full transition-all duration-300 shadow-lg ${
                    inWishlist
                      ? "bg-red-50 hover:bg-red-100"
                      : "bg-white/90 hover:bg-white"
                  } ${isTogglingWishlist ? "opacity-50" : ""}`}
                  disabled={isTogglingWishlist}
                >
                  <Heart
                    size={24}
                    className={`transition-all duration-300 ${
                      inWishlist
                        ? "fill-red-500 text-red-500"
                        : "fill-transparent text-gray-600 hover:text-red-400"
                    }`}
                  />
                </button>
              </div>
              {/* Thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setMainImage(img)}
                      className={`w-20 h-20 flex-shrink-0 rounded-md border-2 transition-all cursor-pointer overflow-hidden relative ${
                        mainImage === img
                          ? "border-brand-gold-subtle"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-[#C9A961]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < product.rating ? "fill-current" : "fill-gray-300"}`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-text-secondary">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-brand-green">
                  ₹{selectedPrice.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-text-secondary line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Product Info Block */}
              <div className="space-y-6 mb-8 border-t border-gray-100">
                {product.pairings && (
                  <div>
                    <p className="text-sm font-medium text-gray-900  mb-2 flex gap-2">
                      <CookingPot size={18} /> <span>Best Pairings</span>
                    </p>
                    <p className="text-text-secondary ms-7 leading-relaxed text-sm">
                      {product.pairings}
                    </p>
                  </div>
                )}

                {/* {product.ingredients && product.ingredients.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                      Key Ingredients
                    </h3>
                    <p className="text-text-secondary leading-relaxed text-sm">
                      {product.ingredients.join(", ")}
                    </p>
                  </div>
                )} */}

                {product.tastingNotes?.texture && (
                  <div>
                    <p className="text-sm font-medium text-gray-900  mb-2 flex gap-2">
                      <UtensilsCrossed size={18} /> <span>Texture</span>
                    </p>
                    <p className="text-text-secondary ms-7 leading-relaxed text-sm">
                      {product.tastingNotes.texture}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-gray-900  mb-2 flex gap-2">
                    <BookOpenText size={18} /> <span>Description</span>
                  </p>
                  <p className="text-text-secondary ms-7 leading-relaxed text-sm">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Weight Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Size:</label>
                <div className="flex flex-wrap gap-2">
                  {weightOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setSelectedWeight(option.label)}
                      className={`px-4 py-2 rounded-md border-2 text-sm font-bold transition-all ${
                        selectedWeight === option.label
                          ? "border-brand-green bg-brand-green text-white"
                          : "border-brand-green bg-white text-brand-green hover:bg-green-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Quantity:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:border-brand-gold-subtle text-xl"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:border-brand-gold-subtle text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 w-max-content btn ${addedToCart ? "bg-green-600 hover:bg-green-600" : "btn-primary"} text-lg py-4`}
                >
                  {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
                {/* <button
                  onClick={handleWishlistToggle}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    inWishlist
                      ? "border-red-400 bg-red-50"
                      : "border-gray-300 hover:border-red-300"
                  }`}
                  disabled={isTogglingWishlist}
                >
                  <Heart
                    size={24}
                    className={`transition-all ${
                      inWishlist
                        ? "fill-red-500 text-red-500"
                        : "fill-transparent text-gray-500"
                    }`}
                  />
                </button> */}
                {/* <button
                  onClick={handleBuyNow}
                  className="btn btn-accent text-lg py-4 px-8"
                >
                  Buy Now
                </button> */}
              </div>

              {/* Trust Badges */}
              {/* <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Free shipping over ₹1,500
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  100% satisfaction guarantee
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      {/* <section className="py-12 bg-bg-cream-light">
        <div className="container mx-auto px-4">
         
          <div className="flex flex-wrap border-b border-gray-300 mb-8">
            {["description", "tasting", "pairings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-brand-gold-subtle text-text-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab === "tasting" ? "Tasting Notes" : tab}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === "description" && (
              <div className="prose prose-lg">
                <p className="text-text-secondary leading-relaxed mb-4">
                  {product.description}
                </p>
                {product.ingredients && (
                  <>
                    <h3
                      className="text-lg font-semibold mt-6 mb-2"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      Ingredients
                    </h3>
                    <p className="text-text-secondary">
                      {product.ingredients.join(", ")}
                    </p>
                  </>
                )}
              </div>
            )}

            {activeTab === "tasting" && product.tastingNotes && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.tastingNotes).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold capitalize mb-2 text-brand-green">
                      {key}
                    </h4>
                    <p className="text-text-secondary text-sm">{value}</p>
                  </div>
                ))}
              </div>
            )}

                <p className="text-text-secondary leading-relaxed">
                  {product.pairings}
                </p>
          </div>
        </div>
      </section> */}

      {/* Related Products */}
      <section className="py-12 bg-gray-200">
        <div className="container mx-auto px-4">
          <h2
            className="text-2xl md:text-3xl mb-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.shortDescription}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                rating={product.rating}
                reviews={product.reviewCount}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2
            className="text-2xl md:text-3xl mb-8 font-bold text-gray-800"
            style={{ fontFamily: "var(--font-heading)" }}
          >
           Best Pairing Recipes
          </h2>
          {product.bestPairingDishes && product.bestPairingDishes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {product.bestPairingDishes.map((dish: any, i: number) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedDish(dish)}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all group cursor-pointer"
                >
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img 
                      src={dish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"} 
                      alt={dish.dishName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white/90 text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">View Recipe</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2 text-brand-gold-subtle text-[10px] font-bold uppercase">
                      <UtensilsCrossed size={12} /> {dish.originCountry || "Artisan Suggestion"}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-green transition-colors">
                      {dish.dishName}
                    </h3>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {dish.shortDescription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary italic">Stay tuned! We're curating the best pairings for this cheese.</p>
          )}
        </div>
      </section>

      <section className="py-12 bg-bg-cream-light">
        <div className="container mx-auto px-4">
          <h2
            className="text-2xl md:text-3xl mb-8 font-bold text-gray-800"
            style={{ fontFamily: "var(--font-heading)" }}
          >
           Customer Experiences
          </h2>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((rev: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green font-bold text-lg">
                        {rev.username?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{rev.username || "Anonymous"}</p>
                        <p className="text-xs text-text-secondary">{rev.restaurantName ? `${rev.restaurantName} • ` : ""}{rev.userArea}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-brand-gold-subtle">
                      {[...Array(5)].map((_, j) => (
                        <svg key={j} className={`w-4 h-4 ${j < rev.rating ? 'fill-current' : 'text-gray-200'}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic relative">
                    <span className="text-4xl text-gray-100 absolute -top-4 -left-2 font-serif">"</span>
                    {rev.comment}
                    <span className="text-4xl text-gray-100 absolute -bottom-8 right-0 font-serif">"</span>
                  </p>
                  <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary italic mb-4">No reviews yet. Be the first to share your experience!</p>
            </div>
          )}
        </div>
      </section>

      {/* Recipe Details Modal */}
      {selectedDish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative animate-in zoom-in-95 duration-500">
            <button 
              onClick={() => setSelectedDish(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-gray-600 hover:bg-gray-400 text-black md:text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="md:w-5/12 h-64 md:h-auto">
              <img src={selectedDish.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"} alt={selectedDish.dishName} className="w-full h-full object-cover" />
            </div>
            
            <div className="md:w-7/12 p-8 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-brand-green/10 text-brand-green text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {selectedDish.difficultyLevel}
                </span>
                <span className="text-xs text-text-secondary flex items-center gap-1">
                   {selectedDish.prepTime}
                </span>
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>{selectedDish.dishName}</h2>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">{selectedDish.whyItPairsWell}</p>
              
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Ingredients</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDish.ingredients.map((ing: string, i: number) => (
                      <li key={i} className="text-sm text-text-secondary flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-brand-gold-subtle rounded-full" /> {ing}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Cooking Process</h3>
                  <div className="space-y-4">
                    {selectedDish.steps.map((step: string, i: number) => (
                      <div key={i} className="flex gap-4">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-green text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                        <p className="text-sm text-text-secondary leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
