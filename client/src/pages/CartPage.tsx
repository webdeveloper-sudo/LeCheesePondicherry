"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useUserStore } from "@/store/useUserStore";
import { Tag, Gift, Sparkles, X } from "lucide-react";
import { orderAPI } from "@/lib/api";
import { useToastStore } from "@/store/useToastStore";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import { trackViewCart } from "@/lib/gtm";

export default function CartPage() {
  const {
    items,
    getProduct,
    updateQuantity,
    updateWeight,
    removeFromCart,
    subtotal,
    totalWeight,
    toggleSelectItem,
    toggleSelectAll,
    totalItems,
    isServerDown,
  } = useCart();
  const { isAuthenticated } = useUserStore();
  const { addToast } = useToastStore();
  const [showTooltip, setShowTooltip] = useState(false);

  // Coupon & Settings State
  const [settings, setSettings] = useState<any>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponType, setCouponType] = useState<"first_time" | "flash_sale" | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/settings`);
        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching settings in CartPage:", error);
      }
    };
    fetchSettings();
  }, []);

  // Restore provisional coupon or active coupon from session
  useEffect(() => {
    const savedCoupon =
      sessionStorage.getItem("activeCouponCode") ||
      localStorage.getItem("provisionalCoupon");

    if (savedCoupon && !isCouponApplied) {
      setCouponCode(savedCoupon);
      if (subtotal > 0) {
        executeApplyCoupon(savedCoupon, false);
      }
    }
  }, [subtotal]);

  // Track view_cart event on CartPage view
  useEffect(() => {
    if (items.length > 0) {
      trackViewCart(
        items.map((item) => {
          const prod = getProduct(item.productId);
          return {
            item_id: item.productId,
            item_name: prod?.name || item.productId,
            price: Number(item.price || (prod ? prod.price : 0)),
            quantity: Number(item.quantity || 1),
            item_variant: item.weight,
            item_category: prod?.category || "Artisanal Cheese",
          };
        }),
        subtotal
      );
    }
  }, [items.length]);

  const executeApplyCoupon = async (codeToApply: string, showToast = true) => {
    const trimmed = codeToApply.trim().toUpperCase();
    if (!trimmed) {
      if (showToast) addToast("Please enter a coupon code", "error");
      return;
    }

    setValidatingCoupon(true);
    try {
      const res = await orderAPI.validateCoupon(trimmed, subtotal);
      if (res.success && res.data && res.data.data) {
        const couponData = res.data.data;
        setAppliedDiscount(couponData.discountAmount);
        setAppliedCoupon(couponData.couponCode);
        setCouponType(couponData.type);
        setIsCouponApplied(true);
        sessionStorage.setItem("activeCouponCode", couponData.couponCode);
        if (showToast) {
          addToast(couponData.message || `Coupon "${couponData.couponCode}" applied successfully!`, "success");
        }
      } else {
        setIsCouponApplied(false);
        setAppliedDiscount(0);
        setAppliedCoupon("");
        setCouponType(null);
        sessionStorage.removeItem("activeCouponCode");
        if (showToast) {
          addToast(res.message || "Invalid coupon code", "error");
        }
      }
    } catch (err: any) {
      setIsCouponApplied(false);
      setAppliedDiscount(0);
      setAppliedCoupon("");
      setCouponType(null);
      sessionStorage.removeItem("activeCouponCode");
      if (showToast) {
        addToast(err?.message || "Failed to validate coupon", "error");
      }
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleApplyCoupon = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeApplyCoupon(couponCode, true);
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon("");
    setAppliedDiscount(0);
    setCouponType(null);
    setIsCouponApplied(false);
    sessionStorage.removeItem("activeCouponCode");
    localStorage.removeItem("provisionalCoupon");
    addToast("Coupon removed.", "info");
  };

  // Recalculate discount if subtotal changes while coupon is applied
  useEffect(() => {
    if (isCouponApplied && appliedCoupon && subtotal > 0) {
      executeApplyCoupon(appliedCoupon, false);
    }
  }, [subtotal]);

  const discount = isCouponApplied ? appliedDiscount : 0;
  const total = Math.max(0, subtotal - discount);

  const selectedCount = items.filter((item) => item.selected !== false).length;
  const isAllSelected = selectedCount === items.length;

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">🧀</div>
            <h1
              className="text-3xl font-bold mb-4 text-text-primary"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your Cart is Empty
            </h1>
            <p className="text-text-secondary mb-8">
              Looks like you haven't added any delicious cheeses yet. Explore
              our collection and find your perfect match!
            </p>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-bg-cream-light">
      <div className="container mx-auto px-4">
        {isServerDown && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 px-5 py-4 rounded-2xl mb-8 flex items-start gap-3 shadow-sm">
            <span className="text-xl leading-none">⚠️</span>
            <div>
              <p className="font-bold text-sm">Offline Fallback Mode</p>
              <p className="text-xs text-amber-700 mt-1">
                The database server is currently unreachable. The website has automatically switched to local fallback mode using static data. You can still manage your local cart, but checkout and account synchronization are disabled.
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Shopping Cart ({totalItems} {totalItems === 1 ? "item" : "items"})
          </h1>

          {items.length > 0 && (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
              <input
                type="checkbox"
                id="select-all"
                checked={isAllSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer"
              />
              <label
                htmlFor="select-all"
                className="text-sm font-semibold text-text-primary cursor-pointer"
              >
                Select All ({items.length})
              </label>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => {
              const product = getProduct(item.productId);

              if (!product) {
                return (
                  <div
                    key={index}
                    className="bg-white p-4 md:p-6 rounded-lg shadow-sm flex gap-4 opacity-75 border-l-4 border-yellow-400"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.selected !== false}
                        onChange={() => toggleSelectItem(index)}
                        className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer"
                      />
                    </div>
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-lg font-semibold text-gray-400 italic">
                            Product details not found
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            ID: {item.productId}
                          </p>
                          <p className="text-sm font-medium text-gray-600 mt-2">
                            Weight: {item.weight}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-text-secondary hover:text-red-500 transition-colors"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                            className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:border-brand-gold-subtle text-text-primary"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-medium text-text-primary">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:border-brand-gold-subtle text-text-primary"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-lg font-semibold text-brand-green">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`bg-white p-4 md:p-6 rounded-lg shadow-sm flex gap-4 transition-all ${
                    item.selected === false ? "opacity-75 grayscale-[0.5]" : ""
                  }`}
                >
                  {/* Select Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={item.selected !== false}
                      onChange={() => toggleSelectItem(index)}
                      className="w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green cursor-pointer"
                    />
                  </div>

                  {/* Product Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-bg-cream-light rounded-lg overflow-hidden relative flex-shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          to={`/products/${product.id}`}
                          className="text-lg font-semibold hover:text-brand-gold-subtle transition-colors text-text-primary"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {product.name}
                        </Link>
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: "200g", multiplier: 1.0 },
                              { label: "400g", multiplier: 1.85 },
                              { label: "600g", multiplier: 2.65 },
                              { label: "800g", multiplier: 3.4 },
                              { label: "1kg", multiplier: 4.1 },
                            ].map((opt) => {
                              const isSelected = item.weight === opt.label;
                              const optPrice = Math.round(
                                product.price * opt.multiplier,
                              );
                              return (
                                <button
                                  key={opt.label}
                                  onClick={() =>
                                    updateWeight(index, opt.label, optPrice)
                                  }
                                  className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
                                    isSelected
                                      ? "bg-brand-green text-white border-brand-green"
                                      : "bg-white text-brand-green border-brand-green hover:bg-green-50"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-text-secondary hover:text-red-500 transition-colors"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(index, item.quantity - 1)
                          }
                          className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:border-brand-gold-subtle text-text-primary"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium text-text-primary">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(index, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:border-brand-gold-subtle text-text-primary"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-lg font-semibold text-brand-green">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-brand-gold-subtle transition-colors"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2
                className="text-xl font-semibold mb-6 text-text-primary"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Order Summary
              </h2>

              {/* Totals */}
              <div className="space-y-3 border-t pt-4">
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Items in Cart
                  </p>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {items.map((item, idx) => {
                      if (item.selected === false) return null;
                      const product = getProduct(item.productId);
                      if (!product) return null;
                      return (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-xs group"
                        >
                          <div className="flex-1 truncate">
                            <span className="font-medium text-text-primary">
                              {item.quantity}x
                            </span>{" "}
                            {product.name}
                          </div>
                          <button
                            onClick={() => removeFromCart(idx)}
                            className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                            title="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                    {selectedCount === 0 && (
                      <p className="text-xs text-red-500 italic">
                        No items selected for checkout
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-text-secondary border-t pt-3">
                  <span>Subtotal</span>
                  <span className="text-text-primary font-bold">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 font-bold bg-emerald-50/60 px-3 py-2 rounded-lg border border-emerald-100">
                    <span className="flex items-center gap-1.5">
                      <Tag size={14} className="text-emerald-600 shrink-0" />
                      <span>Discount ({appliedCoupon})</span>
                    </span>
                    <span>-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                {/* Shipping and Tax calculated on Checkout */}
                <div className="flex justify-between text-lg font-bold pt-3 border-t text-text-primary">
                  <span>Total</span>
                  <span className="text-brand-green">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Promotions & Coupon Code Section */}
              <div className="border-t border-gray-100 pt-6 mt-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag size={13} className="text-[#A67C38]" />
                    <span>Promotions & Coupons</span>
                  </label>
                  {isCouponApplied && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Applied
                    </span>
                  )}
                </div>

                {/* Available Promotional Offer Tags */}
                <div className="space-y-2 mb-3">
                  {/* First-Time Customer Offer Tag */}
                  {settings?.firstTimeOffer?.isEnabled !== false && (
                    <button
                      type="button"
                      onClick={() => {
                        const code = settings?.firstTimeOffer?.couponCode || "CHEESE15";
                        setCouponCode(code);
                        executeApplyCoupon(code, true);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 group cursor-pointer ${
                        isCouponApplied && appliedCoupon === (settings?.firstTimeOffer?.couponCode || "CHEESE15")
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm"
                          : "bg-[#FAF7F2] border-[#E8DFC8] hover:bg-[#F5EFE6] hover:border-[#D5C7B5] text-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1 rounded bg-[#F0E6D2] text-[#A67C38] shrink-0">
                          <Gift size={13} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">
                            <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#D5C7B5] text-[#2B1B17] mr-1.5">
                              {settings?.firstTimeOffer?.couponCode || "CHEESE15"}
                            </span>
                            <span>{settings?.firstTimeOffer?.discountPercent || 15}% OFF FIRST ORDER</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#A67C38] shrink-0 group-hover:underline">
                        {isCouponApplied && appliedCoupon === (settings?.firstTimeOffer?.couponCode || "CHEESE15")
                          ? "✓ Active"
                          : "Apply"}
                      </span>
                    </button>
                  )}

                  {/* Flash Sale Offer Tag (if active) */}
                  {settings?.flashSaleEnabled && settings.couponName && settings.validTime && new Date() < new Date(settings.validTime) && (
                    <button
                      type="button"
                      onClick={() => {
                        const code = settings.couponName;
                        setCouponCode(code);
                        executeApplyCoupon(code, true);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 group cursor-pointer ${
                        isCouponApplied && appliedCoupon === settings.couponName
                          ? "bg-yellow-50 border-yellow-300 text-yellow-800 shadow-sm"
                          : "bg-yellow-50/40 border-yellow-200/80 hover:bg-yellow-50 hover:border-yellow-300 text-yellow-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-1 rounded bg-yellow-100 text-yellow-700 shrink-0">
                          <Sparkles size={13} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">
                            <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-yellow-200 text-yellow-900 mr-1.5">
                              {settings.couponName}
                            </span>
                            <span>{settings.discountRate}% OFF FLASH SALE</span>
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-yellow-700 shrink-0 group-hover:underline">
                        {isCouponApplied && appliedCoupon === settings.couponName
                          ? "✓ Active"
                          : "Apply"}
                      </span>
                    </button>
                  )}
                </div>

                {/* Manual Coupon Input Box */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    disabled={isCouponApplied || validatingCoupon}
                    placeholder={
                      settings?.firstTimeOffer?.couponCode
                        ? `e.g. ${settings.firstTimeOffer.couponCode}`
                        : "Enter Coupon Code"
                    }
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg outline-none uppercase font-semibold text-gray-700 disabled:bg-gray-100 focus:border-[#A67C38] focus:ring-1 focus:ring-[#A67C38] transition-all"
                  />
                  {isCouponApplied ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="px-3 py-2 text-xs font-bold bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <X size={12} />
                      <span>Remove</span>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={validatingCoupon || !couponCode.trim()}
                      className="px-4 py-2 text-xs font-bold bg-[#2B1B17] text-[#F7EFE3] rounded-lg hover:bg-[#422D26] transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer"
                    >
                      {validatingCoupon ? (
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  )}
                </form>
              </div>

              {/* Checkout Button */}
              {selectedCount > 0 ? (
                <Link
                  to="/checkout"
                  className="w-full btn btn-primary text-lg py-4 mt-6 block text-center"
                >
                  Proceed to Checkout ({selectedCount})
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-200 text-gray-400 cursor-not-allowed text-lg font-bold py-4 mt-6 rounded-xl"
                >
                  Select Items to Checkout
                </button>
              )}

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
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
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  Order confirmation via Email
                </div>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Easy returns within 48 hours
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
