"use client";

import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { items, getProduct, updateQuantity, removeFromCart, subtotal } = useCart();

    const discount = 0;
    const shipping = subtotal > 1500 ? 0 : 99;
    const total = subtotal - discount + shipping;

    if (items.length === 0) {
        return (
            <div className="min-h-screen py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="text-6xl mb-6">🧀</div>
                        <h1
                            className="text-3xl font-bold mb-4 text-[#1A1A1A]"
                            style={{ fontFamily: 'var(--font-heading)' }}
                        >
                            Your Cart is Empty
                        </h1>
                        <p className="text-[#6B6B6B] mb-8">
                            Looks like you haven't added any delicious cheeses yet.
                            Explore our collection and find your perfect match!
                        </p>
                        <Link href="/shop" className="btn btn-primary">
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
                <h1
                    className="text-3xl md:text-4xl font-bold mb-8 text-[#1A1A1A]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                >
                    Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, index) => {
                            const product = getProduct(item.productId);
                            if (!product) return null;

                            return (
                                <div key={index} className="bg-white p-4 md:p-6 rounded-lg shadow-sm flex gap-4">
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
                                                    style={{ fontFamily: 'var(--font-heading)' }}
                                                >
                                                    {product.name}
                                                </Link>
                                                <p className="text-sm text-[#6B6B6B]">Size: {item.weight}</p>
                                                <p className="text-xs text-[#888888] mt-1 italic">{product.shortDescription}</p>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(index)}
                                                className="text-[#6B6B6B] hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => updateQuantity(index, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:border-[#C9A961] text-[#1A1A1A]"
                                                >
                                                    −
                                                </button>
                                                <span className="w-8 text-center font-medium text-[#1A1A1A]">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(index, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-md border border-gray-300 flex items-center justify-center hover:border-[#C9A961] text-[#1A1A1A]"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Price */}
                                            <p className="text-lg font-semibold text-[#2C5530]">
                                                ₹{(product.price * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Continue Shopping */}
                        <Link to="/shop" className="inline-flex items-center gap-2 text-[#6B6B6B] hover:text-[#C9A961] transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
                            <h2
                                className="text-xl font-semibold mb-6 text-[#1A1A1A]"
                                style={{ fontFamily: 'var(--font-heading)' }}
                            >
                                Order Summary
                            </h2>

                            {/* Totals */}
                            <div className="space-y-3 border-t pt-4">
                                <div className="mb-4">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Items in Cart</p>
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {items.map((item, idx) => {
                                            const product = getProduct(item.productId);
                                            if (!product) return null;
                                            return (
                                                <div key={idx} className="flex justify-between items-center text-xs group">
                                                    <div className="flex-1 truncate">
                                                        <span className="font-medium text-[#1A1A1A]">{item.quantity}x</span> {product.name}
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
                                    </div>
                                </div>
                                <div className="flex justify-between text-[#6B6B6B] border-t pt-3">
                                    <span>Subtotal</span>
                                    <span className="text-[#1A1A1A]">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[#6B6B6B]">
                                    <span>Shipping</span>
                                    <span className="text-[#1A1A1A]">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                </div>
                                {shipping === 0 && (
                                    <p className="text-xs text-green-600">🎉 You qualify for free shipping!</p>
                                )}
                                <div className="flex justify-between text-lg font-bold pt-3 border-t text-[#1A1A1A]">
                                    <span>Total</span>
                                    <span className="text-[#2C5530]">₹{total.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Link to="/checkout" className="w-full btn btn-primary text-lg py-4 mt-6 block text-center">
                                Proceed to Checkout
                            </Link>

                            {/* Trust Badges */}
                            <div className="mt-6 pt-6 border-t">
                                <div className="flex items-center gap-2 text-sm text-[#6B6B6B] mb-2">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Secure checkout with Razorpay
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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
