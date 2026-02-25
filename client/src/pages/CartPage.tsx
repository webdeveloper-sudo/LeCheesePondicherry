"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useUserStore } from "@/store/useUserStore";

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
  } = useCart();
  const { isAuthenticated, addresses } = useUserStore();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isGuestPuducherry, setIsGuestPuducherry] = useState(false);

  const discount = 0;

  const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
  const isPuducherry = isAuthenticated()
    ? defaultAddr
      ? (defaultAddr.city || "").toLowerCase().includes("puducherry") ||
        (defaultAddr.city || "").toLowerCase().includes("pondicherry") ||
        (defaultAddr.state || "").toLowerCase().includes("puducherry") ||
        (defaultAddr.state || "").toLowerCase().includes("pondicherry")
      : false
    : isGuestPuducherry;

  const calculateDeliveryCharge = (weight: number, pudu: boolean) => {
    if (weight === 0) return 0;
    const slabs = Math.ceil(weight / 200);
    return pudu ? 50 + (slabs - 1) * 30 : 100 + (slabs - 1) * 50;
  };

  const shipping = calculateDeliveryCharge(totalWeight, isPuducherry);
  const taxAmount = Math.round(subtotal * 0.04);
  const total = subtotal - discount + shipping + taxAmount;

  const selectedCount = items.filter((item) => item.selected !== false).length;
  const isAllSelected = selectedCount === items.length;

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="text-6xl mb-6">🧀</div>
            <h1
              className="text-3xl font-bold mb-4 text-[#1A1A1A]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Your Cart is Empty
            </h1>
            <p className="text-[#6B6B6B] mb-8">
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
    <div className="min-h-screen py-12 bg-[#FAF7F2]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-[#1A1A1A]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Shopping Cart ({items.length}{" "}
            {items.length === 1 ? "item" : "items"})
          </h1>

          {items.length > 0 && (
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
              <input
                type="checkbox"
                id="select-all"
                checked={isAllSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-[#2C5530] focus:ring-[#2C5530] cursor-pointer"
              />
              <label
                htmlFor="select-all"
                className="text-sm font-semibold text-[#1A1A1A] cursor-pointer"
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
              if (!product) return null;

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
                      className="w-5 h-5 rounded border-gray-300 text-[#2C5530] focus:ring-[#2C5530] cursor-pointer"
                    />
                  </div>

                  {/* Product Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-[#FAF7F2] rounded-lg overflow-hidden relative flex-shrink-0">
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
                          className="text-lg font-semibold hover:text-[#C9A961] transition-colors text-[#1A1A1A]"
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
                                      ? "bg-[#2C5530] text-white border-[#2C5530]"
                                      : "bg-white text-[#2C5530] border-[#2C5530] hover:bg-green-50"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        {/* <p className="text-xs text-[#888888] mt-1 italic">
                          {product.shortDescription}
                        </p> */}
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-[#6B6B6B] hover:text-red-500 transition-colors"
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
                          className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:border-[#C9A961] text-[#1A1A1A]"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium text-[#1A1A1A]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(index, item.quantity + 1)
                          }
                          className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:border-[#C9A961] text-[#1A1A1A]"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-lg font-semibold text-[#2C5530]">
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
              className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#C9A961] transition-colors"
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
                className="text-xl font-semibold mb-6 text-[#1A1A1A]"
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
                            <span className="font-medium text-[#1A1A1A]">
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
                <div className="flex justify-between text-[#6B6B6B] border-t pt-3">
                  <span>Subtotal</span>
                  <span className="text-[#1A1A1A]">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B6B6B] items-center">
                  <div className="flex items-center gap-1.5">
                    <span>Shipping</span>
                    <div className="relative inline-block">
                      <button
                        onClick={() => setShowTooltip(!showTooltip)}
                        className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] text-gray-500 hover:border-[#2C5530] hover:text-[#2C5530] transition-colors"
                        title="Click for info"
                      >
                        i
                      </button>
                      {showTooltip && (
                        <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-900 text-white text-[11px] rounded-xl shadow-xl w-64 z-50 leading-relaxed animate-in fade-in zoom-in slide-in-from-bottom-2">
                          <div className="relative">
                            We are packing your order with specialized packaging
                            and trying to deliver you without 0% quality loss.
                            <div className="absolute -bottom-4 left-1 w-2 h-2 bg-gray-900 rotate-45" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[#1A1A1A]">
                    ₹{shipping.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-[#6B6B6B]">
                  <span>Tax and Charges</span>
                  <span className="text-[#1A1A1A]">
                    ₹{taxAmount.toLocaleString()}
                  </span>
                </div>
                {isPuducherry && (
                  <div className="text-[10px] font-bold text-[#2C5530] bg-green-50 p-2 rounded-lg border border-green-100 animate-in fade-in slide-in-from-top-1">
                    Special 50% discount for Puducherrians only.
                  </div>
                )}
                {!isAuthenticated() && !isGuestPuducherry && (
                  <div className="pt-2 text-center">
                    <button
                      onClick={() => setIsGuestPuducherry(true)}
                      className="text-xs text-[#2C5530] underline hover:text-[#C9A961] transition-colors"
                    >
                      Are you located in Puducherry?
                    </button>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t text-[#1A1A1A]">
                  <span>Total</span>
                  <span className="text-[#2C5530]">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
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
                <div className="flex items-center gap-2 text-sm text-[#6B6B6B] mb-2">
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
                  Secure checkout with Razorpay
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
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
