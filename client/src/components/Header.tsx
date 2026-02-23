"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { products, Product } from "@/data/products";
import { User, LogOut, Heart } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import FlashSaleBanner from "./FlashSaleBanner";
import logo from "@/assets/images/logo.jpg";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, imageVariant } from "@/animations/variants";

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const { totalItems } = useCart();
  const { name, isAuthenticated, wishlistCount, role } = useUserStore();
  const userName = name ? name.split(" ")[0] : "User"; // Get first name
  const [isClient, setIsClient] = useState(false);
  const location = useLocation(); // Add this import
  const isHomeRoute = location.pathname === "/";
  const logoVariants = {
    initial: { rotate: 0, scale: 0.9, opacity: 0 },
    animate: isHomeRoute
      ? {
          rotate: 360,
          scale: 1,
          opacity: 1,
          transition: {
            rotate: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: 0.8, ease: "easeOut" },
            opacity: { duration: 0.6 },
          },
        }
      : { scale: 1, opacity: 1, transition: { duration: 0.6 } },
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: { duration: 0.3 },
    },
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (query: string) => {
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "Our Story" },
    { href: "/process", label: "Artisan Process" },
    { href: "/gifts", label: "Gifts" },
    { href: "/stories", label: "Journal" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed mb-10 top-0 z-50 w-full bg-white shadow-sm">
      <FlashSaleBanner />
      <div className="mx-12  px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/">
            <span
              className="text-xl md:text-2xl font-semibold text-[#2C5530]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Le Pondicherry Cheese
            </span>
          </Link>
          {/* Desktop Navigation */}
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <ul className="flex items-center gap-8">
              {navLinks.slice(0, 3).map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="nav-link text-sm uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Logo & Brand Name */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                className="relative w-32 h-32 mx-4 overflow-hidden top-6 rounded-full border p-1 bg-white border-gray-100 shadow-sm"
                variants={logoVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
              >
                <img
                  src={logo}
                  alt="Le Pondicherry Cheese Logo"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </Link>
            <ul className="flex items-center gap-8">
              {navLinks.slice(3, 6).map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="nav-link text-sm uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {role === "user" || !isAuthenticated() ? (
              <>
                {/* Search */}
                <div className="relative" ref={searchRef}>
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="p-2 hover:text-[#C9A961] transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>

                  {searchOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white shadow-2xl rounded-lg p-4 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                      <div className="flex gap-2">
                        <input
                          autoFocus
                          type="text"
                          placeholder="Search cheeses..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSearchSubmit(searchQuery)
                          }
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#C9A961]"
                        />
                        <button
                          onClick={() => handleSearchSubmit(searchQuery)}
                          className="bg-[#2C5530] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#1a3a20] transition-colors"
                        >
                          Go
                        </button>
                      </div>

                      {suggestions.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            Suggestions
                          </p>
                          <ul className="space-y-2">
                            {suggestions.map((product) => (
                              <li key={product.id}>
                                <button
                                  onClick={() => {
                                    navigate(`/products/${product.id}`);
                                    setSearchOpen(false);
                                    setSearchQuery("");
                                  }}
                                  className="w-full flex items-center gap-3 p-2 hover:bg-[#FAF7F2] rounded-md transition-colors text-left group"
                                >
                                  <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    <img
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold text-[#1A1A1A] group-hover:text-[#2C5530]">
                                      {product.name}
                                    </p>
                                    <p className="text-[10px] text-[#6B6B6B] uppercase">
                                      {product.category}
                                    </p>
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="p-2 hover:text-[#C9A961] transition-colors relative"
                >
                  <Heart
                    size={20}
                    className={
                      wishlistCount > 0 ? "fill-red-500 text-red-500" : ""
                    }
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="p-2 hover:text-[#C9A961] transition-colors relative"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FAB519] text-[#1D161A] text-xs rounded-full flex items-center justify-center font-medium">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <div></div>
            )}

            {/* User Profile / Sign In */}
            {isClient && isAuthenticated() ? (
              <Link
                to={role === "user" ? "/user" : "/admin/dashboard"}
                className="p-2 hover:text-[#C9A961] transition-colors flex items-center gap-1 font-medium text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-[#2C5530] text-white flex items-center justify-center text-xs">
                  {userName.charAt(0)}
                </div>
                <span className="hidden md:inline">{userName}</span>
              </Link>
            ) : (
              <Link
                to="/user/login"
                className="p-2 hover:text-[#C9A961] transition-colors flex items-start gap-1"
              >
                <User size={21} />
                Sign In
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav>
              <ul className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-lg font-medium py-2 hover:text-[#C9A961] transition-colors block"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
