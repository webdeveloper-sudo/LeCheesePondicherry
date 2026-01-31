"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Search, X, ChevronDown, Check, ArrowUpDown } from "lucide-react";
import { products, categories, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ShopClient() {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Subscription states
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchTerm(query);
      setActiveCategory("all"); // Reset category when searching
      setIsSearchOpen(true);
    } else {
      setSearchTerm("");
    }
  }, [searchParams]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredByCategory =
    activeCategory === "all"
      ? products.filter((p) => p.category !== "subscriptions")
      : products.filter((p) => p.category === activeCategory);

  const filteredBySearch = searchTerm
    ? filteredByCategory.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : filteredByCategory;

  const sortedProducts = [...filteredBySearch].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0; // featured - keep original order
  });

  const subscriptionPlans = products.filter(
    (p) => p.category === "subscriptions",
  );

  const handleSubscribe = async (planId: string) => {
    setSubscribingId(planId);
    const plan = products.find((p) => p.id === planId);

    // Simulate API/Notification lag
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const emailPayload = {
      to: "technicalhead@achariya.org",
      subject: `Shop Page - New Subscription Interest: ${plan?.name}`,
      body: `
                Brand: Le Pondicherry Cheese
                Page: Shop Page
                Activity: User clicked Subscribe for ${plan?.name}
                Price: ₹${plan?.price}/month
                Timestamp: ${new Date().toLocaleString()}
                Action: Item added to cart for checkout.
            `.trim(),
    };

    console.log("--- MOCK SUBSCRIPTION NOTIFICATION ---");
    console.log("To:", emailPayload.to);
    console.log("Content:\n", emailPayload.body);
    console.log("---------------------------");

    if (plan) {
      addToCart(plan.id, 1, plan.weight);
    }

    setSubscribingId(null);
    setSuccessId(planId);
    setTimeout(() => setSuccessId(null), 3000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/shop-hero-new.jpg")' }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4 text-white-prominent"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Shop Artisan Cheeses
          </h1>
          <p className="text-xl text-white-prominent max-w-2xl mx-auto">
            Premium quality, delivered fresh to your door
          </p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat.id
                      ? "bg-[#2C5530] text-white"
                      : "bg-gray-100 text-[#1A1A1A] hover:bg-gray-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search & Sort Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
              {/* Search */}
              <div className="relative" ref={searchRef}>
                <div
                  className={`flex items-center transition-all duration-300 ${isSearchOpen ? "w-64" : "w-10"}`}
                >
                  {isSearchOpen ? (
                    <div className="relative w-full">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search cheeses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#C9A961] focus:ring-1 focus:ring-[#C9A961]"
                      />
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setIsSearchOpen(false);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-[#C9A961] hover:text-[#C9A961] transition-all"
                    >
                      <Search size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-[#C9A961] transition-all min-w-[160px] justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={16} className="text-[#6B6B6B]" />
                    <span>
                      {sortBy === "featured" && "Featured"}
                      {sortBy === "price-low" && "Price: Low to High"}
                      {sortBy === "price-high" && "Price: High to Low"}
                      {sortBy === "name" && "Name"}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-[#6B6B6B] transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {[
                      { value: "featured", label: "Featured" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                      { value: "name", label: "Name" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setSortBy(option.value);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#FAF7F2] flex items-center justify-between group transition-colors ${
                          sortBy === option.value
                            ? "text-[#2C5530] font-medium bg-[#FAF7F2]"
                            : "text-[#4A4A4A]"
                        }`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value && (
                          <Check size={16} className="text-[#C9A961]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Count & Clear Search */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-[#6B6B6B]">
              Showing {sortedProducts.length}{" "}
              {sortedProducts.length === 1 ? "product" : "products"}
              {searchTerm && (
                <span>
                  {" "}
                  for "<span className="font-semibold">{searchTerm}</span>"
                </span>
              )}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  window.history.replaceState(null, "", "/shop");
                }}
                className="text-sm text-[#2C5530] hover:underline font-medium"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.shortDescription}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                rating={product.rating}
                reviews={product.reviews}
              />
            ))}
          </div>

          {/* Empty State */}
          {sortedProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-[#6B6B6B]">
                No products found
                {searchTerm ? " matching your search" : " in this category"}.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchTerm("");
                  window.history.replaceState(null, "", "/shop");
                }}
                className="mt-4 btn btn-secondary"
              >
                View All Cheeses
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Subscription CTA */}
      <section className="py-16 bg-[#FAF7F2]">
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Never Run Out of Cheese
          </h2>
          <p className="text-[#6B6B6B] max-w-2xl mx-auto mb-12">
            Subscribe to our Monthly Cheese Club and receive 3-4 artisan cheeses
            delivered fresh to your door. Save 15% on every order and discover
            new flavors each month.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`bg-white p-8 rounded-2xl shadow-lg border-2 transition-transform duration-300 hover:-translate-y-2 ${plan.featured ? "border-[#C9A961] scale-105 relative" : "border-transparent"}`}
              >
                {plan.featured && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#C9A961] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    Popular
                  </span>
                )}
                <div className="text-center mb-6">
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {plan.name.replace("Cheese Club ", "")}
                  </h3>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-bold text-[#2C5530]">
                      ₹{plan.price.toLocaleString()}
                    </span>
                    <span className="text-[#6B6B6B]">/month</span>
                  </div>
                  <p className="text-sm text-[#888888] mt-2">
                    {plan.shortDescription}
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                    <span className="text-[#C9A961] font-bold">✓</span>
                    <span>
                      {plan.id === "sub-explorer"
                        ? "3"
                        : plan.id === "sub-enthusiast"
                          ? "4"
                          : "5"}{" "}
                      curated artisan cheeses
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                    <span className="text-[#C9A961] font-bold">✓</span>
                    <span>Temperature-controlled national shipping</span>
                  </div>
                </div>

                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-4 rounded-lg font-bold transition-all duration-300 ${
                    successId === plan.id
                      ? "bg-green-600 text-white"
                      : plan.featured
                        ? "bg-[#C9A961] text-white hover:bg-[#B8942F]"
                        : "bg-[#F5E6D3] text-[#2C5530] hover:bg-[#E8D5B8]"
                  } ${subscribingId === plan.id ? "opacity-70 cursor-wait" : ""}`}
                  disabled={subscribingId !== null}
                >
                  {subscribingId === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Processing...
                    </span>
                  ) : successId === plan.id ? (
                    "✓ Plan Added!"
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
