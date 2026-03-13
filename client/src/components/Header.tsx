"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { products, Product } from "@/data/products";
import {
  User,
  LogOut,
  Heart,
  LocateIcon,
  Map,
  Mail,
  Phone,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import FlashSaleBanner from "./FlashSaleBanner";
import logo from "@/assets/images/logo.jpg";
import { motion } from "framer-motion";
import { staggerContainer, fadeUp, imageVariant } from "@/animations/variants";
import TopHeader from "./TopHeader";

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
    { href: "/about", label: "About Us" },
    { href: "/process", label: "Artisan Process" },
    { href: "/wholesale", label: "Wholesale" },
    { href: "/stories", label: "Journal" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed mb-10 top-0 z-50 w-full bg-white shadow-sm">
      {/* <FlashSaleBanner /> */}

      {/* Desktop menu => */}
      <div className="hidden md:block">
        <TopHeader />
        <div className=" mx-auto px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link to="/" className="flex-shrink-0">
              <span
                className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#2C5530] truncate"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Le Pondicherry Cheese
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center">
              <ul className="flex items-center gap-6 xl:gap-8">
                {navLinks.slice(0, 3).map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="nav-link text-xs xl:text-sm uppercase tracking-wider"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              {/* Logo & Brand Name */}
              <Link to="/" className="flex items-center gap-3 group">
                <motion.div
                  className="relative w-24 h-24 xl:w-32 xl:h-32 mx-4 overflow-hidden top-4 xl:top-6 rounded-full border p-1 bg-white border-gray-100 shadow-sm"
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
              <ul className="flex items-center gap-6 xl:gap-8">
                {navLinks.slice(3, 6).map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="nav-link text-xs xl:text-sm uppercase tracking-wider"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {role === "user" || !isAuthenticated() ? (
                <>
                  {/* Search */}
                  <div className="relative" ref={searchRef}>
                    <button
                      onClick={() => setSearchOpen(!searchOpen)}
                      className="p-1.5 sm:p-2 hover:text-[#C9A961] transition-colors"
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
                      <div className="absolute right-0 mt-3 w-[280px] sm:w-80 bg-white shadow-2xl rounded-lg p-4 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            type="text"
                            placeholder="Search cheeses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) =>
                              e.key === "Enter" &&
                              handleSearchSubmit(searchQuery)
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
                    className="p-1.5 sm:p-2 hover:text-[#C9A961] transition-colors relative"
                  >
                    <Heart
                      size={20}
                      className={
                        wishlistCount > 0 ? "fill-red-500 text-red-500" : ""
                      }
                    />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    className="p-1.5 sm:p-2 hover:text-[#C9A961] transition-colors relative"
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
                      <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#FAB519] text-[#1D161A] text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                </>
              ) : (
                <div className="w-4"></div>
              )}

              {/* User Profile / Sign In */}
              {isClient && isAuthenticated() ? (
                <Link
                  to={role === "user" ? "/user" : "/admin/dashboard"}
                  className="p-1.5 sm:p-2 hover:text-[#C9A961] transition-colors flex items-center gap-1.5 font-medium text-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-[#2C5530] text-white flex items-center justify-center text-xs">
                    {userName.charAt(0)}
                  </div>
                  <span className="hidden lg:inline">{userName}</span>
                </Link>
              ) : (
                <Link
                  to="/user/login"
                  className="p-1.5 sm:p-2 hover:text-[#C9A961] transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <User size={18} className="sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-1.5 sm:p-2 focus:outline-none"
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

          {/* Mobile Menu Overlay removed from here */}
        </div>
      </div>

      {/* Mobile Menu => */}
      <div className="block md:hidden">
        <div className="flex justify-between items-center -mt-9 border-b pe-3 border-gray-300">
          <Link to="/" className="flex items-center gap-3">
            <motion.div
              className=" w-24 h-24 xl:w-28 xl:h-28 mx-4 border border-[#FADD9D] border-2 relative top-12 overflow-hidden rounded-full p-1 bg-white shadow-sm"
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
          <div className="flex gap-2 mt-9">
            <div>
              <svg
                className="w-8 h-8 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                onClick={() => setMobileMenuOpen(true)}
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
            </div>
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center justify-end gap-2 py-3   bg-gradient-to-r from-[#FAB519] py-1 px-4 via-[#fadea0] to-[#FAB519] bg-[length:200%_100%] animate-shimmer shadow-md text-[#1D161A]">
          {role === "user" || !isAuthenticated() ? (
            <>
              {/* Wishlist */}
              {/* <Link
                  to="/wishlist"
                  className="p-1.5 sm:p-2 hover:text-[#C9A961] transition-colors relative"
                >
                  <Heart
                    size={20}
                    className={
                      wishlistCount > 0 ? "fill-red-500 text-red-500" : ""
                    }
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
                      {wishlistCount}
                    </span>
                  )}
                </Link> */}
            </>
          ) : (
            <div className="w-4"></div>
          )}
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 sm:p-2 hover:text-[#C9A961] transition-colors"
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
              <div className="absolute -right-25 px-6  top-14 sm:w-80 bg-white shadow-2xl rounded-lg p-4 border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
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

          {/* Cart */}
          <Link
            to="/cart"
            className="p-1.5 sm:p-2 hover:text-[#C9A961] transition-colors relative"
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
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#FAB519] text-[#1D161A] text-[10px] sm:text-xs rounded-full flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>
          {/* User Profile / Sign In */}
          {isClient && isAuthenticated() ? (
            <Link
              to={role === "user" ? "/user" : "/admin/dashboard"}
              className="p-1.5 sm:p-2 hover:text-[#C9A961] transition-colors flex items-center gap-1.5 font-medium text-sm"
            >
              <div className="w-8 h-8 rounded-full bg-[#2C5530] text-white flex items-center justify-center text-xs">
                {userName.charAt(0)}
              </div>
              <span className="hidden lg:inline">{userName}</span>
            </Link>
          ) : (
            <Link
              to="/user/login"
              className="p-1.5 sm:p-2 hover:text-[#C9A961] transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <User size={18} className="sm:w-5 sm:h-5" />
              <span className="">Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Canvas (Right Slide-In) */}
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ease-in-out ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Sidebar Canvas */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-[85vw] max-w-[350px] bg-[#FAF7F2] z-[100] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Canvas Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#2C5530]/10 bg-white">
          <span
            className="text-xl font-semibold text-[#2C5530]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Menu
          </span>
          <button
            className="p-2 focus:outline-none hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg
              className="w-6 h-6 text-[#2C5530]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-6 overflow-y-auto flex-1">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  style={{ fontFamily: "var(--font-heading)" }}
                  className="text-xl font-semibold py-4 px-2 hover:text-[#C9A961] border-b border-[#2C5530]/10 transition-colors block text-[#2C5530]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start bg-green p-5 rounded-xl">
            {/* <h5 className="footer-header text-left font-bold mb-6 text-green uppercase tracking-widest text-xs">
              Reach Us
            </h5> */}
            <address className="not-italic space-y-4 text-sm text-white">
              <p className="flex gap-2 items-start">
                <Map size={40} /> Marie Oulgaret, Auroville Road Pondicherry -
                605111, India
              </p>
              <div className="pt-2">
                <a
                  href="mailto:hello@lepondicheese.com"
                  className="hover:text-[#C9A961] transition-colors block font-medium flex gap-2 items-start"
                >
                  <Mail size={18} />
                  hello@lepondicheese.com
                </a>
              </div>
              <div className="pt-1">
                <a
                  href="tel:+919150121331"
                  className="hover:text-[#C9A961] transition-colors block font-medium flex gap-2 items-start"
                >
                  <Phone size={18} />
                  +91 91501 21331
                </a>
              </div>
            </address>
            {/* Social Icons */}
            <div className="flex justify-center md:justify-start gap-5 mt-8 text-white">
              {[
                {
                  href: "https://www.facebook.com/people/LepondicherryCheese/61579368624195/",
                  path: "M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z",
                },
                {
                  href: "https://www.instagram.com/lepondicherrycheese",
                  path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                },
                {
                  href: "https://www.youtube.com/@lepondicherrycheese",
                  path: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
                },
                {
                  href: "https://www.linkedin.com/company/le-pondicherry-cheese",
                  path: "M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z",
                },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-all hover:scale-110"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
      {/* Menu end */}
    </header>
  );
}
