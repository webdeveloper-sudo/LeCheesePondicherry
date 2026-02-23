"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { wishlistAPI } from "@/lib/api";
import { products, Product } from "@/data/products";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { MotionContainer } from "@/components/ui/MotionPrimitives";
import { motion } from "framer-motion";
import { fadeUp } from "@/animations/variants";

interface WishlistItem {
  productId: string;
  addedAt: string;
}

export default function WishlistPage() {
  const { isAuthenticated, wishlistIds, toggleWishlist, fetchWishlist } =
    useUserStore();
  const { addToCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [movingToCart, setMovingToCart] = useState<string | null>(null);

  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);

      if (isAuthenticated()) {
        await fetchWishlist();
      }

      setLoading(false);
    };

    loadWishlist();
  }, [isAuthenticated, fetchWishlist]);

  useEffect(() => {
    // Get product details for wishlist items
    const wishlistProductsList = products.filter((p) =>
      wishlistIds.includes(p.id),
    );
    setWishlistProducts(wishlistProductsList);
  }, [wishlistIds]);

  const handleRemoveFromWishlist = async (productId: string) => {
    await toggleWishlist(productId);
  };

  const handleMoveToCart = async (productId: string) => {
    setMovingToCart(productId);
    try {
      // Add to cart (default 200g)
      const product = products.find((p) => p.id === productId);
      addToCart(productId, 1, "200g", product?.price || 0);

      // If authenticated, also call backend API to move
      if (isAuthenticated()) {
        await wishlistAPI.moveToCart(productId, 1);
        await fetchWishlist();
      } else {
        // For guests, just remove from wishlist
        await toggleWishlist(productId);
      }
    } finally {
      setMovingToCart(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C5530] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1
            className="text-3xl font-bold text-[#2C5530]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            My Wishlist
          </h1>
          <p className="text-gray-600 mt-2">
            {wishlistProducts.length} items saved
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {wishlistProducts.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={48} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start exploring our artisan cheeses and save your favorites!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-[#2C5530] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a3a20] transition-colors"
            >
              Explore Shop <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          // Wishlist Grid
          <MotionContainer
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            stagger
          >
            {wishlistProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={fadeUp}
                className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <Link
                  to={`/products/${product.id}`}
                  className="block relative aspect-square bg-[#FAF7F2] overflow-hidden group"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <Link to={`/products/${product.id}`}>
                    <h3
                      className="text-lg font-medium text-[#1A1A1A] mb-1 hover:text-[#C9A961] transition-colors"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.shortDescription}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-semibold text-[#2C5530]">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveToCart(product.id)}
                      disabled={movingToCart === product.id}
                      className="flex-1 flex items-center justify-center gap-2 bg-[#2C5530] text-white py-2.5 rounded-lg font-medium hover:bg-[#1a3a20] transition-colors disabled:opacity-50"
                    >
                      {movingToCart === product.id ? (
                        "Adding..."
                      ) : (
                        <>
                          <ShoppingCart size={18} />
                          Add to Cart
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="p-2.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </MotionContainer>
        )}
      </div>
    </div>
  );
}
