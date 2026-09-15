"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard from "@/components/ProductCard";
import {
  Search,
  X,
  ChevronDown,
  Check,
  ArrowUpDown,
  SlidersHorizontal,
  Star,
  RotateCcw,
  Sparkles,
  Layers,
  IndianRupee,
} from "lucide-react";
import {
  categories,
  Product,
} from "@/data/products";
import { useCart } from "@/context/CartContext";
import heroImage from "@/assets/images/hero-cheese-board.webp";
import DynamicPageBanner from "@/components/DynamicPageBanner";
import { Loader } from "lucide-react";
import { useShopStore } from "@/store/useShopStore";

export default function ShopClient() {
  const {
    allProducts,
    loading: cartLoading,
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
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    setPriceRange,
    setMinRating,
    setInStockOnly,
    clearFilters,
  } = useShopStore();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [customMinPrice, setCustomMinPrice] = useState<string>(minPrice ? String(minPrice) : "");
  const [customMaxPrice, setCustomMaxPrice] = useState<string>(maxPrice ? String(maxPrice) : "");

  const sortRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("search");
    const categoryParam = searchParams.get("category");

    if (query) {
      setSearchTerm(query);
      setActiveCategory("all");
      setIsSearchOpen(true);
    }

    if (categoryParam) {
      setActiveCategory(categoryParam);
      if (!query) {
        setSearchTerm("");
        setIsSearchOpen(false);
      }
    }
  }, [searchParams, setSearchTerm, setActiveCategory, setIsSearchOpen]);

  // Keep custom price inputs synced with store
  useEffect(() => {
    setCustomMinPrice(minPrice !== null ? String(minPrice) : "");
    setCustomMaxPrice(maxPrice !== null ? String(maxPrice) : "");
  }, [minPrice, maxPrice]);

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

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: products.filter((p) => p.category !== "subscriptions").length,
    };
    categories.forEach((cat) => {
      if (cat.id !== "all") {
        counts[cat.id] = products.filter((p) => p.category === cat.id).length;
      }
    });
    return counts;
  }, [products]);

  // Filter Pipeline
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Exclude subscriptions from standard shop catalog
      if (p.category === "subscriptions") return false;

      // Category filter
      if (activeCategory !== "all" && p.category !== activeCategory) {
        return false;
      }

      // Search filter
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(term);
        const matchesDesc = p.shortDescription?.toLowerCase().includes(term);
        const matchesFullDesc = p.description?.toLowerCase().includes(term);
        if (!matchesName && !matchesDesc && !matchesFullDesc) {
          return false;
        }
      }

      // Price filter
      if (minPrice !== null && p.price < minPrice) return false;
      if (maxPrice !== null && p.price > maxPrice) return false;

      // Rating filter
      if (minRating !== null && (p.rating || 0) < minRating) return false;

      // Stock filter
      if (inStockOnly && p.inStock === false) return false;

      return true;
    });
  }, [products, activeCategory, searchTerm, minPrice, maxPrice, minRating, inStockOnly]);

  // Sort Pipeline
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0; // featured default
    });
  }, [filteredProducts, sortBy]);

  const hasActiveFilters = Boolean(
    activeCategory !== "all" ||
      searchTerm.trim() !== "" ||
      minPrice !== null ||
      maxPrice !== null ||
      minRating !== null ||
      inStockOnly
  );

  const activeFiltersCount =
    (activeCategory !== "all" ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0) +
    (minPrice !== null || maxPrice !== null ? 1 : 0) +
    (minRating !== null ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const min = customMinPrice ? parseFloat(customMinPrice) : null;
    const max = customMaxPrice ? parseFloat(customMaxPrice) : null;
    setPriceRange(min, max);
  };

  const handleClearAll = () => {
    clearFilters();
    setCustomMinPrice("");
    setCustomMaxPrice("");
    window.history.replaceState(null, "", "/shop");
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
      {/* Dynamic Banner with Breadcrumbs & Variant Management */}
      <DynamicPageBanner
        pageKey="/shop"
        fallbackVariant="BreadcrumbSlider"
        fallbackTitle="Handcrafted Artisan Cheeses"
      />

      {/* Shop Content */}
      <section className="py-8 md:py-12">
        <div className="max-w-[1500px] mx-auto px-4">

          {/* ========================================================
              MOBILE FILTER BAR (Unchanged Experience as requested)
              ======================================================== */}
          <div className="block md:hidden mb-6">
            <div className="flex items-center justify-between gap-2">
              {/* Category Mobile Dropdown */}
              <div className="relative flex-1" ref={categoryRef}>
                <button
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium shadow-sm hover:border-brand-gold-subtle transition-all"
                >
                  <span className="truncate max-w-[140px]">
                    {categories.find((c) => c.id === activeCategory)?.name ||
                      "Categories"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-text-secondary transition-transform duration-200 ml-1 ${
                      isCategoryOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isCategoryOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
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

              {/* Mobile Search */}
              <div className="relative" ref={searchRef}>
                <div
                  className={`flex items-center transition-all duration-300 ${
                    isSearchOpen ? "w-44" : "w-10"
                  }`}
                >
                  {isSearchOpen ? (
                    <div className="relative w-full">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:border-brand-gold-subtle"
                      />
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setIsSearchOpen(false);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:border-brand-gold-subtle hover:text-brand-gold-subtle shadow-sm transition-all"
                    >
                      <Search size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Sort Dropdown */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center gap-1.5 px-3 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium shadow-sm hover:border-brand-gold-subtle transition-all"
                >
                  <ArrowUpDown size={15} className="text-text-secondary" />
                  <ChevronDown
                    size={15}
                    className={`text-text-secondary transition-transform duration-200 ${
                      isSortOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isSortOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    {[
                      { value: "featured", label: "Featured" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                      { value: "rating", label: "Customer Rating" },
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

            {/* Mobile Category Description & Clear search */}
            <div className="mt-3 flex items-center justify-between text-xs text-text-secondary px-1">
              <p className="line-clamp-1">
                {categories.find((cat) => cat.id === activeCategory)?.description}
              </p>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setIsSearchOpen(false);
                    window.history.replaceState(null, "", "/shop");
                  }}
                  className="text-brand-green font-medium ml-2 whitespace-nowrap hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>

          {/* ========================================================
              DESKTOP E-COMMERCE SIDEBAR LAYOUT (Amazon / Flipkart style)
              ======================================================== */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Left Vertical Sidebar */}
            <aside className="hidden md:block w-72 flex-shrink-0 sticky top-28 bg-white rounded-2xl border border-[#051F44]/20 shadow-sm p-6 space-y-6">
              {/* Sidebar Header & Clear All */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-text-primary font-bold text-base">
                  <SlidersHorizontal size={18} className="text-brand-green" />
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-brand-green text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-semibold transition-colors"
                  >
                    <RotateCcw size={13} />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* 1. Search Input in Left Sidebar */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Search Cheeses
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search name, notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-gray-50/80 hover:bg-white focus:bg-white border border-gray-200 rounded-xl text-sm text-text-primary placeholder:text-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Sort By / Featured (Moved to Left Sidebar for Desktop Only) */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Sort By
                  </label>
                  <ArrowUpDown size={14} className="text-gray-400" />
                </div>
                <div className="space-y-1">
                  {[
                    { value: "featured", label: "Featured" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "rating", label: "Customer Rating" },
                    { value: "name", label: "Name: A to Z" },
                  ].map((option) => {
                    const isSelected = sortBy === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group text-left ${
                          isSelected
                            ? "bg-brand-green text-white shadow-2xs font-semibold"
                            : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check size={14} className="text-brand-gold" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Categories (Department Filter) */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Category
                  </label>
                  <Layers size={14} className="text-gray-400" />
                </div>
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const isSelected = activeCategory === cat.id;
                    const count = categoryCounts[cat.id] ?? 0;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all group text-left ${
                          isSelected
                            ? "bg-brand-green text-white shadow-sm font-semibold"
                            : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-all ${
                              isSelected
                                ? "bg-brand-gold scale-125"
                                : "bg-transparent group-hover:bg-gray-300"
                            }`}
                          />
                          <span className="truncate">{cat.name}</span>
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ml-2 ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Price Filter */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Price Range
                  </label>
                  <IndianRupee size={14} className="text-gray-400" />
                </div>
                {/* Price Presets */}
                <div className="space-y-1">
                  {[
                    { label: "All Prices", min: null, max: null },
                    { label: "Under ₹400", min: null, max: 400 },
                    { label: "₹400 – ₹500", min: 400, max: 500 },
                    { label: "₹500 & Above", min: 500, max: null },
                  ].map((bracket, idx) => {
                    const isSelected =
                      minPrice === bracket.min && maxPrice === bracket.max;
                    return (
                      <button
                        key={idx}
                        onClick={() => setPriceRange(bracket.min, bracket.max)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                          isSelected
                            ? "text-brand-green font-bold bg-brand-gold/15"
                            : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
                        }`}
                      >
                        <span>{bracket.label}</span>
                        {isSelected && <Check size={14} className="text-brand-green" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Min / Max Inputs */}
                <form
                  onSubmit={handleApplyCustomPrice}
                  className="flex items-center gap-2 pt-2"
                >
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="Min"
                      value={customMinPrice}
                      onChange={(e) => setCustomMinPrice(e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:bg-white"
                    />
                  </div>
                  <span className="text-xs text-gray-400">–</span>
                  <div className="relative flex-1">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={customMaxPrice}
                      onChange={(e) => setCustomMaxPrice(e.target.value)}
                      className="w-full pl-6 pr-2 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-green focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-brand-green hover:bg-brand-green-dark text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                  >
                    Go
                  </button>
                </form>
              </div>

              {/* 5. Customer Rating Filter (Amazon / Flipkart Style) */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    Customer Ratings
                  </label>
                  <Star size={14} className="text-gray-400" />
                </div>
                <div className="space-y-1">
                  {[
                    { rating: null, label: "All Ratings" },
                    { rating: 4.5, label: "4.5★ & above" },
                    { rating: 4.0, label: "4.0★ & above" },
                  ].map((r, idx) => {
                    const isSelected = minRating === r.rating;
                    return (
                      <button
                        key={idx}
                        onClick={() => setMinRating(r.rating)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                          isSelected
                            ? "text-brand-green font-bold bg-brand-gold/15"
                            : "text-text-secondary hover:text-text-primary hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {r.rating ? (
                            <div className="flex items-center text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className={
                                    i < Math.floor(r.rating!)
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-gray-300 fill-gray-200"
                                  }
                                />
                              ))}
                            </div>
                          ) : (
                            <Sparkles size={13} className="text-gray-400" />
                          )}
                          <span>{r.label}</span>
                        </div>
                        {isSelected && <Check size={14} className="text-brand-green" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Availability Filter */}
              <div className="pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2.5 text-xs text-text-primary font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-green focus:ring-brand-green border-gray-300 cursor-pointer"
                  />
                  <span>Exclude Out of Stock</span>
                </label>
              </div>
            </aside>

            {/* Right Main Product Listing Area */}
            <main className="flex-1 w-full min-w-0">
              {/* Desktop Header Row */}
              {/* <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm mb-6">
                <div>
                  <h2
                    className="text-2xl font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {categories.find((cat) => cat.id === activeCategory)?.name ||
                      "Artisan Cheeses"}
                  </h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {categories.find((cat) => cat.id === activeCategory)?.description ||
                      "Handcrafted French and Continental style cheeses."}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary font-medium whitespace-nowrap bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    Showing{" "}
                    <strong className="text-text-primary">
                      {sortedProducts.length}
                    </strong>{" "}
                    cheeses
                  </span>
                </div>
              </div> */}

              {/* Active Filter Chips / Pills */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-xs text-text-secondary font-medium mr-1">
                    Active Filters:
                  </span>

                  {activeCategory !== "all" && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-text-primary shadow-2xs">
                      <span>
                        Category:{" "}
                        <strong>
                          {categories.find((c) => c.id === activeCategory)?.name}
                        </strong>
                      </span>
                      <button
                        onClick={() => setActiveCategory("all")}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  )}

                  {searchTerm && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-text-primary shadow-2xs">
                      <span>
                        Search: <strong>"{searchTerm}"</strong>
                      </span>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  )}

                  {(minPrice !== null || maxPrice !== null) && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-text-primary shadow-2xs">
                      <span>
                        Price:{" "}
                        <strong>
                          {minPrice !== null && maxPrice !== null
                            ? `₹${minPrice} - ₹${maxPrice}`
                            : minPrice !== null
                            ? `₹${minPrice}+`
                            : `Under ₹${maxPrice}`}
                        </strong>
                      </span>
                      <button
                        onClick={() => setPriceRange(null, null)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  )}

                  {minRating !== null && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-text-primary shadow-2xs">
                      <span>
                        Rating: <strong>{minRating}★+</strong>
                      </span>
                      <button
                        onClick={() => setMinRating(null)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  )}

                  {inStockOnly && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-text-primary shadow-2xs">
                      <span>In Stock Only</span>
                      <button
                        onClick={() => setInStockOnly(false)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  )}

                  <button
                    onClick={handleClearAll}
                    className="text-xs text-brand-green font-bold hover:underline ml-1"
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/80 p-8 shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Search size={28} />
                  </div>
                  <h3
                    className="text-xl font-bold text-text-primary mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    No matching cheeses found
                  </h3>
                  <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
                    Try adjusting your search terms, changing the price range, or
                    clearing filters to discover all our handcrafted cheeses.
                  </p>
                  <button
                    onClick={handleClearAll}
                    className="btn btn-primary bg-brand-green text-white hover:bg-brand-green-dark px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* Wholesale Banner Section */}
      <section className="py-16 bg-yellow-gradient">
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

