import {
  products as staticProducts,
  testimonials,
  Product,
} from "@/data/products";
import HomeClient from "@/components/HomeClient";
import { FETCH_MODE } from "@/config";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "@/context/CartContext";

export default function HomePage() {
  const { allProducts, loading: cartLoading, isServerDown } = useCart();
  
  const products = allProducts;
  const loading = cartLoading;

  const featuredProducts = products.filter(
    (p: Product) => p.featured && p.category !== "subscriptions",
  );
  const subscriptionPlans = products.filter(
    (p: Product) => p.category === "subscriptions",
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pattern">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2C5530]"></div>
      </div>
    );
  }

  return (
    <HomeClient
      featuredProducts={featuredProducts}
      subscriptionPlans={subscriptionPlans}
      testimonials={testimonials}
    />
  );
}
