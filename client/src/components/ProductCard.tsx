import { Link } from "react-router-dom";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviews?: number;
}

export default function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  image,
  rating = 5,
  reviews = 0,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist, trackProductView } = useUserStore();
  const [isToggling, setIsToggling] = useState(false);
  const inWishlist = isInWishlist(id);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isToggling) return;

    setIsToggling(true);
    try {
      await toggleWishlist(id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleProductClick = () => {
    // Track this product view for preferences
    trackProductView(id);
  };

  return (
    <div className="product-card group bg-white rounded-lg overflow-hidden border border-gray-100 flex flex-col h-full relative">
      {/* Wishlist Heart Button */}
      <button
        onClick={handleWishlistToggle}
        className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-300 ${
          inWishlist
            ? "bg-red-50 hover:bg-red-100"
            : "bg-white/80 hover:bg-white shadow-md"
        } ${isToggling ? "opacity-50" : ""}`}
        disabled={isToggling}
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={20}
          className={`transition-all duration-300 ${
            inWishlist
              ? "fill-red-500 text-red-500"
              : "fill-transparent text-gray-500 hover:text-red-400"
          }`}
        />
      </button>

      {/* Image Container */}
      <Link
        to={`/products/${id}`}
        className="block relative aspect-square overflow-hidden bg-[#FAF7F2]"
        onClick={handleProductClick}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
          <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-[#1A1A1A] px-4 py-2 rounded-md text-sm font-medium shadow-lg">
            Quick View
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Product Name */}
        <Link to={`/products/${id}`} onClick={handleProductClick}>
          <h3
            className="text-lg font-medium text-[#1A1A1A] mb-1 hover:text-[#C9A961] transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-[#6B6B6B] mb-2 line-clamp-2">
          {description}
        </p>

        {/* Rating */}
        {reviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-[#C9A961]">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < rating ? "fill-current" : "fill-gray-300"}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-[#6B6B6B]">({reviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-semibold text-[#2C5530]">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-[#6B6B6B] line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button - pushed to bottom with mt-auto */}
        <Link
          to={`/products/${id}`}
          className="block w-full mt-auto"
          onClick={handleProductClick}
        >
          <button className="w-full btn btn-secondary text-sm py-2 group-hover:bg-[#C9A961] group-hover:text-white group-hover:border-[#C9A961]">
            View Details
          </button>
        </Link>
      </div>
    </div>
  );
}
