"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import { Search, X, ChevronDown, Check, ArrowUpDown } from "lucide-react";
import {
  products as staticProducts,
  categories,
  Product,
} from "@/data/products";
import { useCart } from "@/context/CartContext";
import heroImage from "@/assets/images/hero-cheese-board.webp";
import BannerAndBreadCrumb from "@/components/BannerAndBreadCrumb";
import { Loader } from "lucide-react";
import { useShopStore } from "@/store/useShopStore";

export default function ShopClient() {
  const {
    addToCart,
    allProducts,
    loading: cartLoading,
    isServerDown,
  } = useCart();

  const products = allProducts;
  const loading = cartLoading;

  const {
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    searchTerm,
    setSearchTerm,
    isSearchOpen,
    setIsSearchOpen,
    clearFilters,
  } = useShopStore();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  // Subscription states
  const [subscribingId, setSubscribingId] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchTerm(query);
      setActiveCategory("all"); // Reset category when searching from URL
      setIsSearchOpen(true);
    }
    // We don't clear the searchTerm if it's NOT in the params, 
    // because that's when we want the PERSISTENT store to take over.
  }, [searchParams, setSearchTerm, setActiveCategory, setIsSearchOpen]);

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
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
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

  console.log("sortedProducts", sortedProducts);

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
      addToCart(plan.id, 1, plan.weight, plan.price);
    }

    setSubscribingId(null);
    setSuccessId(planId);
    setTimeout(() => setSuccessId(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pattern flex flex-col">
        <div
          className="relative h-[40vh] min-h-[400px] flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 hero-overlay" />
          <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-4">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 text-white-prominent"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Shop Artisan Cheeses
            </h1>
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center py-20">
          <Loader className="animate-spin text-brand-green" size={48} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern">
      {/* Hero Banner */}
      <BannerAndBreadCrumb title="Shop Artisan Cheeses" img={heroImage} />

      {/* Shop Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters Row */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="hidden md:block">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === cat.id
                        ? "bg-brand-green text-white"
                        : "bg-gray-100 text-text-primary hover:bg-gray-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Search & Sort Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="md:hidden block relative z-20" ref={categoryRef}>
                {/* Category Mobile Tabs Dropdown */}
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-brand-gold-subtle transition-all min-w-[140px] justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[120px]">
                      {categories.find((c) => c.id === activeCategory)?.name ||
                        "Categories"}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-text-secondary transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isCategoryOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategory(cat.id);
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-bg-cream-light flex items-center justify-between group transition-colors ${
                          activeCategory === cat.id
                            ? "text-brand-green font-medium bg-bg-cream-light"
                            : "text-text-secondary"
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {activeCategory === cat.id && (
                          <Check size={16} className="text-brand-gold-subtle" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
                        className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-brand-gold-subtle focus:ring-1 focus:ring-brand-gold-subtle"
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
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-brand-gold-subtle hover:text-brand-gold-subtle transition-all"
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
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium hover:border-brand-gold-subtle transition-all min-w-[160px] justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ArrowUpDown size={16} className="text-text-secondary" />
                    <span>
                      {sortBy === "featured" && "Featured"}
                      {sortBy === "price-low" && "Price: Low to High"}
                      {sortBy === "price-high" && "Price: High to Low"}
                      {sortBy === "name" && "Name"}
                    </span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-text-secondary transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
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
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-bg-cream-light flex items-center justify-between group transition-colors ${
                          sortBy === option.value
                            ? "text-brand-green font-medium bg-bg-cream-light"
                            : "text-text-secondary"
                        }`}
                      >
                        <span>{option.label}</span>
                        {sortBy === option.value && (
                          <Check size={16} className="text-brand-gold-subtle" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count & Clear Search */}
        <div className="container flex justify-between items-center ">
          <p className="text-sm text-text-secondary mb-8">
         {
          categories.find((cat) => cat.id === activeCategory)?.description
         }
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setIsSearchOpen(false);
                window.history.replaceState(null, "", "/shop");
              }}
              className="text-sm text-brand-green hover:underline font-medium"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Product Grid */}
        <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
              reviewCount={product.reviewCount}
            />
          ))}
        </div>

        {/* Empty State */}
        {sortedProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-text-secondary">
              No products found
              {searchTerm ? " matching your search" : " in this category"}.
            </p>
            <button
              onClick={() => {
                clearFilters();
                window.history.replaceState(null, "", "/shop");
              }}
              className="mt-4 btn btn-secondary"
            >
              View All Cheeses
            </button>
          </div>
        )}
      </section>

      <section
        className="py-16 bg-yellow-gradient"
      >
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl mb-4 font-bold text-text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Wholesale & Partnerships
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mb-10 text-lg">
            Elevate your menu with Pondicherry's finest handcrafted artisan
            cheeses. We partner with premium restaurants, hotels, and cafes
            across India.
          </p>
          <div className="flex justify-center">
            <Link
              to="/wholesale"
              className="btn btn-primary bg-brand-green text-white hover:bg-brand-green-dark px-10 py-4 text-lg rounded-full font-bold shadow-xl transition-all hover:scale-105"
            >
              Enquire for Wholesale
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
