"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { products, Product } from "@/data/products";
import { Clock, ArrowRight } from "lucide-react";

export default function RecentlyViewedSection() {
  const { recentlyViewed, isAuthenticated } = useUserStore();
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Get product details for recently viewed items
    const productsList = recentlyViewed
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is Product => p !== undefined);
    setViewedProducts(productsList);
  }, [recentlyViewed]);

  if (viewedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Clock className="text-[#C9A961]" size={24} />
            <h2
              className="text-2xl font-bold text-[#2C5530]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Recently Viewed
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-[#2C5530] font-medium hover:text-[#C9A961] transition-colors flex items-center gap-1"
          >
            View All <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {viewedProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group bg-[#FAF7F2] rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-3">
                <h3
                  className="text-sm font-medium text-[#1A1A1A] line-clamp-1 group-hover:text-[#C9A961] transition-colors"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {product.name}
                </h3>
                <p className="text-sm font-semibold text-[#2C5530] mt-1">
                  ₹{product.price.toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
