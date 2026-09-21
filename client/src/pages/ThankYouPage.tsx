"use client";

import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Package,
  Truck,
  Home,
  Copy,
  Check,
  Printer,
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  Sparkles,
  Thermometer,
  ShieldCheck,
  ArrowRight,
  Share2,
  Calendar,
  CreditCard,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useCart } from "@/context/CartContext";
import { products as staticProducts, Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

import { orderAPI } from "@/lib/api";
import { trackPurchase } from "@/lib/gtm";

export default function ThankYouPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { name: userName, email: userEmail, mobile: userMobile, isAuthenticated } = useUserStore();
  const { allProducts } = useCart();

  const [copied, setCopied] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Extract query params or state
  const queryOrderId = searchParams.get("order_id");
  const queryType = searchParams.get("type") || "order"; // 'order' | 'enquiry' | 'subscription'

  // Only show order details if user came via order redirection with an order_id or location.state.order
  const isOrderConfirmation = Boolean(
    queryOrderId ||
    (location.state && location.state.order)
  );

  useEffect(() => {
    document.title = isOrderConfirmation
      ? "Order Confirmed | Le Pondicherry Cheese"
      : "Thank You | Le Pondicherry Cheese";
  }, [isOrderConfirmation]);

  useEffect(() => {
    // Only fetch / load order details if this is actually an order confirmation
    if (!isOrderConfirmation) return;

    // 1. Try to get order from location state if passed from checkout
    if (location.state && location.state.order) {
      setOrderDetails(location.state.order);
      return;
    }

    // 2. Try to get order from localStorage
    const savedOrder = localStorage.getItem("lepondy_pending_order") || localStorage.getItem("lepondy_last_order");
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder);
        setOrderDetails(parsed);
      } catch (e) {
        console.error("Error parsing saved order", e);
      }
    }

    // 3. If queryOrderId is present and user is logged in, try to fetch order details from API
    if (queryOrderId && isAuthenticated()) {
      orderAPI.getMyOrders().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const found = res.data.find(
            (o: any) =>
              o.orderId === queryOrderId ||
              o.cfOrderId === queryOrderId ||
              o._id === queryOrderId
          );
          if (found) {
            setOrderDetails(found);
          }
        }
      }).catch((err) => {
        console.error("Failed to fetch order details", err);
      });
    }
  }, [location.state, queryOrderId, isOrderConfirmation, isAuthenticated]);

  const displayOrderId =
    queryOrderId ||
    orderDetails?.orderId ||
    orderDetails?._id ||
    orderDetails?.cfOrderId ||
    "LPC-" + Math.floor(100000 + Math.random() * 900000);

  const displayDate = orderDetails?.createdAt
    ? new Date(orderDetails.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(displayOrderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const dynamicSource = allProducts && allProducts.length > 0 ? allProducts : staticProducts;
  const recommendedCheeses: Product[] = dynamicSource
    .filter((p: Product) => p.category !== "subscriptions")
    .slice(0, 3);

  // 1. Direct Visit (SEO Services / Form Submissions): Simple Thank You Note Only
  if (!isOrderConfirmation) {
    return (
      <div className="min-h-screen bg-pattern py-12 sm:py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-3xl shadow-xl border border-amber-100/70 overflow-hidden text-center p-8 sm:p-12"
          >
            <div className="h-2 -mt-8 sm:-mt-12 -mx-8 sm:-mx-12 mb-8 bg-gradient-to-r from-brand-green via-brand-gold to-brand-gold-subtle" />

            {/* Simple Clean Thank You Icon */}
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10 sm:w-11 sm:h-11 text-emerald-600" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-gold/15 text-brand-green font-bold text-xs sm:text-sm mb-3">
              <span>Le Pondicherry Cheese</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Thank You!
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-lg mx-auto mb-8 leading-relaxed">
              We have received your message. Thank you for connecting with us. Our team will review your enquiry and get back to you shortly.
            </p>

            {/* Direct Contact Support Box */}
            <div className="bg-bg-cream-light/60 p-5 rounded-2xl border border-amber-100/70 mb-8 text-sm text-text-secondary">
              <p className="font-semibold text-text-primary mb-1">Have an urgent question or need immediate assistance?</p>
              <p>
                Reach our concierge at{" "}
                <a href="tel:+919443202620" className="text-brand-green font-bold hover:underline">
                  +91 94432 02620
                </a>{" "}
                or email{" "}
                <a href="mailto:info@cheeseandchocolates.com" className="text-brand-green font-bold hover:underline">
                  info@cheeseandchocolates.com
                </a>
              </p>
            </div>

            {/* Clean CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/"
                className="btn btn-primary px-8 py-3.5 text-sm font-bold flex items-center gap-2 shadow-md shadow-brand-gold/15"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </Link>
              <Link
                to="/shop"
                className="btn btn-secondary px-8 py-3.5 text-sm font-bold flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Browse Cheeses
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // 2. Order Placed Confirmation (When order_id is present)
  // Actual order items
  const orderItems: any[] = orderDetails?.items && orderDetails.items.length > 0
    ? orderDetails.items
    : [
        {
          productId: dynamicSource[0]?.id || "baby-swiss",
          name: dynamicSource[0]?.name || "Artisanal Baby Swiss",
          weight: dynamicSource[0]?.weight || "200g",
          quantity: 1,
          price: dynamicSource[0]?.price || 420,
          image: dynamicSource[0]?.image || staticProducts[0]?.image,
        },
      ];

  const subtotal = orderDetails?.subtotal || orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryCharge = orderDetails?.deliveryCharge ?? 80;
  const taxAmount = orderDetails?.taxAmount ?? 0;
  const discount = orderDetails?.discount ?? 0;
  const finalAmount = orderDetails?.finalAmount || (subtotal + deliveryCharge + taxAmount - discount);

  const shippingInfo = orderDetails?.shippingAddress || {
    name: userName || "Valued Connoisseur",
    phone: userMobile || "+91 84388 92532",
    address: "White Town",
    city: "Pondicherry",
    state: "Puducherry",
    pincode: "605001",
  };

  const hasTrackedPurchase = useRef(false);

  useEffect(() => {
    if (isOrderConfirmation && displayOrderId && !hasTrackedPurchase.current) {
      hasTrackedPurchase.current = true;
      trackPurchase({
        transactionId: String(displayOrderId),
        value: Number(finalAmount),
        tax: Number(taxAmount),
        shipping: Number(deliveryCharge),
        coupon: orderDetails?.couponCode || undefined,
        items: orderItems.map((item) => ({
          item_id: String(item.productId || item.id || "cheese"),
          item_name: String(item.name || "Artisanal Cheese"),
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 1),
          item_variant: item.weight || "200g",
        })),
      });
    }
  }, [isOrderConfirmation, displayOrderId, finalAmount, taxAmount, deliveryCharge, orderDetails, orderItems]);

  return (
    <div className="min-h-screen bg-pattern py-12 sm:py-16">
      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Thank You Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-xl border border-amber-100/60 overflow-hidden mb-10"
        >
          {/* Top Gold Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-brand-green via-brand-gold to-brand-gold-subtle" />

          <div className="p-6 sm:p-10 md:p-12 text-center">
            {/* Animated Celebration Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.1,
              }}
              className="relative inline-block mb-6"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-100 to-emerald-50 flex items-center justify-center shadow-inner border border-amber-200">
                <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-emerald-600" strokeWidth={2} />
              </div>
              <span className="absolute -top-1 -right-1 flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-brand-gold items-center justify-center text-xs text-brand-green font-bold">
                  ✨
                </span>
              </span>
            </motion.div>

            {/* Sub-badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/15 text-brand-green font-bold text-xs sm:text-sm mb-3">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span>Merci Beaucoup! Order Placed Successfully</span>
            </div>

            {/* Main Headline */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-3"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Thank You For Your Order!
            </h1>

            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8">
              We have received your artisanal cheese order. Our master cheesemakers are preparing your batch with care in temperature-controlled packaging.
            </p>

            {/* Order Reference Pill & Quick Info */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-bg-cream-light border border-brand-gold/30 rounded-2xl p-4 sm:px-6 mb-8 text-left">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-text-secondary block">
                  Order Reference
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="font-mono font-bold text-base sm:text-lg text-brand-green">
                    #{displayOrderId}
                  </span>
                  <button
                    onClick={handleCopyOrderId}
                    className="p-1 rounded-md hover:bg-white text-gray-400 hover:text-brand-green transition-all"
                    title="Copy Order ID"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="h-8 w-px bg-gray-200 hidden sm:block" />

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-text-secondary block">
                  Order Date
                </span>
                <span className="font-semibold text-sm sm:text-base text-text-primary mt-0.5 block flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                  {displayDate}
                </span>
              </div>

              <div className="h-8 w-px bg-gray-200 hidden sm:block" />

              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-text-secondary block">
                  Delivery Method
                </span>
                <span className="font-semibold text-sm sm:text-base text-emerald-700 mt-0.5 block flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  Insulated Express (24-48 hrs)
                </span>
              </div>
            </div>

            {/* Interactive Timeline */}
            <div className="bg-white/80 rounded-2xl p-6 border border-gray-100 max-w-3xl mx-auto text-left shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-primary mb-6 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-gold" />
                Estimated Order Journey
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                {/* Step 1 */}
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-emerald-600/20">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-text-primary">Order Confirmed</h4>
                    <p className="text-[11px] text-text-secondary mt-0.5">Order verified & logged</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-2">
                  <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-green flex items-center justify-center font-bold text-sm shrink-0 shadow-md shadow-brand-gold/20">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-text-primary">Cold Packaging</h4>
                    <p className="text-[11px] text-text-secondary mt-0.5">Packed with chill gel packs</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-2 opacity-70">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm shrink-0 border border-gray-200">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-text-primary">Express Transit</h4>
                    <p className="text-[11px] text-text-secondary mt-0.5">Temperature-controlled</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex sm:flex-col items-center sm:items-start gap-4 sm:gap-2 opacity-70">
                  <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm shrink-0 border border-gray-200">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-text-primary">Fresh Delivery</h4>
                    <p className="text-[11px] text-text-secondary mt-0.5">Delivered to your door</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
              <Link
                to="/orders"
                className="btn btn-primary px-8 py-3.5 text-sm font-bold flex items-center gap-2 shadow-lg shadow-brand-gold/15"
              >
                <Package className="w-4 h-4" />
                Track In My Orders
              </Link>

              <Link
                to="/shop"
                className="btn btn-secondary px-8 py-3.5 text-sm font-bold flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Explore More Cheeses
              </Link>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-gray-200 text-text-primary hover:bg-gray-50 font-bold text-sm transition-all"
              >
                <Printer className="w-4 h-4 text-gray-500" />
                Print Confirmation
              </button>
            </div>
          </div>
        </motion.div>

        {/* 2-Column Section: Order Breakdown & Delivery Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Items & Summary (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h2
                className="text-2xl font-bold text-text-primary mb-6 flex items-center justify-between"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span>Items in this Order</span>
                <span className="text-sm font-sans font-normal text-text-secondary">
                  {orderItems.length} {orderItems.length === 1 ? "Product" : "Products"}
                </span>
              </h2>

              <div className="divide-y divide-gray-100">
                {orderItems.map((item, index) => {
                  const product = staticProducts.find((p) => p.id === item.productId || p.name === item.name);
                  const displayImg = item.image || product?.image || staticProducts[0]?.image;

                  return (
                    <div key={index} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-bg-cream-light overflow-hidden shrink-0 border border-gray-100">
                        <img
                          src={displayImg}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm sm:text-base text-text-primary truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-text-secondary mt-0.5">
                          Variant: <span className="font-semibold text-text-primary">{item.weight || "Standard"}</span> • Qty: <span className="font-semibold text-text-primary">{item.quantity}</span>
                        </p>
                        <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Handcrafted artisan batch
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-sm sm:text-base text-brand-green">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          ₹{item.price} each
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Calculation */}
              <div className="border-t border-gray-100 mt-6 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Subtotal</span>
                  <span className="font-bold text-text-primary">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600 font-bold">
                    <span>Discount Applied</span>
                    <span>-₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Insulated Cold Delivery</span>
                  <span className="font-bold text-text-primary">
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge.toLocaleString("en-IN")}`}
                  </span>
                </div>
                {taxAmount > 0 && (
                  <div className="flex justify-between text-sm text-text-secondary">
                    <span>Taxes & GST</span>
                    <span className="font-bold text-text-primary">
                      ₹{taxAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-black text-lg sm:text-xl pt-4 border-t border-gray-100 text-text-primary">
                  <span>Total Amount</span>
                  <span className="text-brand-green">
                    ₹{finalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Artisan Cheese Care & Savoring Guide */}
            <div className="bg-bg-cream-light/60 border border-brand-gold/30 rounded-3xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold">
                  🧀
                </div>
                <div>
                  <h3
                    className="text-xl font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    Artisan Cheese Care & Tasting Notes
                  </h3>
                  <p className="text-xs text-text-secondary">
                    Tips from our master fromager for optimal flavor
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-4 rounded-2xl border border-amber-100/80 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-text-primary mb-1">
                    <Thermometer className="w-4 h-4 text-brand-gold" />
                    <span>Serving Temp</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Allow cheese to rest at room temp (20°C) for 20-30 mins prior to serving to release rich aromatic notes.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-100/80 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-text-primary mb-1">
                    <ShieldCheck className="w-4 h-4 text-brand-gold" />
                    <span>Storage</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Store in parchment/wax wrap in the lowest crisper drawer (4°C–8°C) to allow living cultures to breathe.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-amber-100/80 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-xs text-text-primary mb-1">
                    <Sparkles className="w-4 h-4 text-brand-gold" />
                    <span>Pairings</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Pair with raw wildflower honey, crushed walnuts, fresh figs, and crisp baguette slices.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Info, Delivery Address & Help (1 col) */}
          <div className="space-y-6">
            {/* Delivery Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
              <h3
                className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <MapPin className="w-5 h-5 text-brand-gold" />
                Shipping Destination
              </h3>

              <div className="space-y-3 text-sm text-text-secondary">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 block">
                    Recipient
                  </span>
                  <p className="font-bold text-text-primary mt-0.5">
                    {shippingInfo.name}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 block">
                    Delivery Address
                  </span>
                  <p className="text-text-primary leading-relaxed mt-0.5">
                    {shippingInfo.address}
                    <br />
                    {shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 block">
                    Contact Phone
                  </span>
                  <p className="font-bold text-brand-green flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5" />
                    {shippingInfo.phone}
                  </p>
                </div>

                {userEmail && (
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 block">
                      Email Confirmation
                    </span>
                    <p className="text-text-primary flex items-center gap-1.5 mt-0.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {userEmail}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3
                className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Payment Confirmation
              </h3>
              <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-900">Payment Completed</p>
                  <p className="text-[11px] text-emerald-700">Processed securely via Cashfree Payments</p>
                </div>
              </div>
            </div>

            {/* Customer Concierge / Support Card */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3
                className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <HelpCircle className="w-5 h-5 text-brand-gold" />
                Need Assistance?
              </h3>
              <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                Have questions regarding delivery timing or custom charcuterie styling? Our Pondicherry concierge is ready to assist.
              </p>

              <div className="space-y-2">
                <a
                  href="https://wa.me/919443212345?text=Hello%20Le%20Pondicherry%20Cheese,%20I%20have%20an%20inquiry%20regarding%20my%20order"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Chat on WhatsApp
                </a>

                <Link
                  to="/contact"
                  className="w-full py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-text-primary text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Contact Support Page
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* You Might Also Savor Section */}
        {recommendedCheeses.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200/70">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-brand-gold block mb-1">
                  Artisan Recommendations
                </span>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-text-primary"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  You Might Also Savor
                </h2>
              </div>
              <Link
                to="/shop"
                className="text-sm font-bold text-brand-green hover:text-brand-gold flex items-center gap-1.5 transition-colors"
              >
                View Full Catalog
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCheeses.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  description={product.shortDescription || product.description}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={product.image}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
