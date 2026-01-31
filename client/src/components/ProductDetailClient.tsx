"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useUserStore } from "@/store/useUserStore";
import { Heart } from "lucide-react";

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

  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(
    product.weight || "250g",
  );
  const [activeTab, setActiveTab] = useState("description");
  const [addedToCart, setAddedToCart] = useState(false);
  const [mainImage, setMainImage] = useState(product.image);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const inWishlist = isInWishlist(product.id);

  // Track product view when component mounts
  useEffect(() => {
    trackProductView(product.id);
  }, [product.id, trackProductView]);

  const weightOptions = [
    { label: "250g", price: product.price },
    { label: "500g", price: Math.round(product.price * 1.85) },
    { label: "1kg", price: Math.round(product.price * 3.5) },
  ];

  const selectedPrice =
    weightOptions.find((w) => w.label === selectedWeight)?.price ||
    product.price;

  const handleAddToCart = () => {
    addToCart(product.id, quantity, selectedWeight);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product.id, quantity, selectedWeight);
    navigate("/checkout");
  };

  const handleWishlistToggle = async () => {
    if (isTogglingWishlist) return;
    setIsTogglingWishlist(true);
    try {
      await toggleWishlist(product.id);
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="bg-[#FAF7F2] py-4">
        <div className="container mx-auto px-4">
          <ol className="flex items-center text-sm text-[#6B6B6B]">
            <li>
              <Link to="/" className="hover:text-[#C9A961]">
                Home
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link to="/shop" className="hover:text-[#C9A961]">
                Shop
              </Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-[#1A1A1A]">{product.name}</li>
          </ol>
        </div>
      </nav>

      {/* Product Details */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative">
              <div className="aspect-square bg-[#FAF7F2] rounded-lg overflow-hidden relative">
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
                          ? "border-[#C9A961]"
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
                <span className="text-sm text-[#6B6B6B]">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-[#2C5530]">
                  ₹{selectedPrice.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-[#6B6B6B] line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-[#6B6B6B] mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Weight Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Size:</label>
                <div className="flex gap-2">
                  {weightOptions.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setSelectedWeight(option.label)}
                      className={`px-4 py-2 rounded-md border-2 text-sm font-medium transition-all ${
                        selectedWeight === option.label
                          ? "border-[#2C5530] bg-[#2C5530] text-white"
                          : "border-gray-300 hover:border-[#C9A961]"
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
                    className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:border-[#C9A961] text-xl"
                  >
                    −
                  </button>
                  <span className="w-12 text-center text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-md border border-gray-300 flex items-center justify-center hover:border-[#C9A961] text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart & Wishlist */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 btn ${addedToCart ? "bg-green-600 hover:bg-green-600" : "btn-primary"} text-lg py-4`}
                >
                  {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
                <button
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
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn btn-accent text-lg py-4 px-8"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 text-sm text-[#6B6B6B]">
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
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-12 bg-[#FAF7F2]">
        <div className="container mx-auto px-4">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-300 mb-8">
            {["description", "tasting", "pairings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? "border-b-2 border-[#C9A961] text-[#1A1A1A]"
                    : "text-[#6B6B6B] hover:text-[#1A1A1A]"
                }`}
              >
                {tab === "tasting" ? "Tasting Notes" : tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-3xl">
            {activeTab === "description" && (
              <div className="prose prose-lg">
                <p className="text-[#6B6B6B] leading-relaxed mb-4">
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
                    <p className="text-[#6B6B6B]">{product.ingredients}</p>
                  </>
                )}
              </div>
            )}

            {activeTab === "tasting" && product.tastingNotes && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.tastingNotes).map(([key, value]) => (
                  <div key={key} className="bg-white p-4 rounded-lg">
                    <h4 className="font-semibold capitalize mb-2 text-[#2C5530]">
                      {key}
                    </h4>
                    <p className="text-[#6B6B6B] text-sm">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "pairings" && product.pairings && (
              <div>
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Perfect Pairings
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.pairings.map((pairing, i) => (
                    <span
                      key={i}
                      className="bg-white px-4 py-2 rounded-full text-sm text-[#6B6B6B] border border-gray-200"
                    >
                      {pairing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2
            className="text-2xl md:text-3xl mb-8"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                className="product-card bg-white rounded-lg overflow-hidden border border-gray-100 group"
              >
                <div className="aspect-square bg-[#FAF7F2] relative overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3
                    className="font-medium mb-1"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {p.name}
                  </h3>
                  <p className="text-[#2C5530] font-semibold">
                    ₹{p.price.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
