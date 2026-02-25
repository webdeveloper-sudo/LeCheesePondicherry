"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useUserStore } from "@/store/useUserStore";
import { orderAPI, userAPI } from "@/lib/api";
import {
  Home,
  Briefcase,
  MapPin,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  MoreVertical,
  Navigation,
  Edit2,
  X,
  Phone,
  User as UserIcon,
} from "lucide-react";

declare global {
  interface Window {
    Cashfree: any;
  }
}

export default function CheckoutPage() {
  const { items, getProduct, subtotal, totalWeight, clearCart } = useCart();
  const selectedItems = items.filter((item) => item.selected !== false);
  const {
    isAuthenticated,
    name: userName,
    email: userEmail,
    mobile: userMobile,
    token,
    addresses,
    syncProfile,
  } = useUserStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">(
    "shipping",
  );
  const [isLocating, setIsLocating] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // Address state
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  );
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressLabel, setAddressLabel] = useState("Home");
  const [customLabel, setCustomLabel] = useState("");

  // Shipping form for "Add/Edit Address"
  const [shipping, setShipping] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [gpsCoords, setGpsCoords] = useState<string>("Not detected");

  const discount = 0;

  const isPuducherry =
    shipping.city.toLowerCase().includes("puducherry") ||
    shipping.city.toLowerCase().includes("pondicherry") ||
    shipping.state.toLowerCase().includes("puducherry") ||
    shipping.state.toLowerCase().includes("pondicherry");

  const calculateDeliveryCharge = (weight: number, pudu: boolean) => {
    if (weight === 0) return 0;
    const slabs = Math.ceil(weight / 200);
    return pudu ? 50 + (slabs - 1) * 30 : 100 + (slabs - 1) * 50;
  };

  const deliveryCharge = calculateDeliveryCharge(totalWeight, isPuducherry);
  const taxAmount = Math.round(subtotal * 0.04);
  const total = subtotal - discount + deliveryCharge + taxAmount;

  const fetchAddressesAndSetDefault = async () => {
    try {
      await syncProfile();
      // After syncProfile, the 'addresses' from useUserStore should be updated.
      // But we need to use them from the store state.
      // Since 'addresses' is from destructuring, it might be the old value in this closure.
      // However, useEffect will trigger on syncProfile completion if we're careful.
      // Actually, let's just use the current 'addresses' from the store.
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setIsAddingNew(true);
    }
  };

  useEffect(() => {
    if (
      isAuthenticated() &&
      addresses &&
      addresses.length > 0 &&
      !selectedAddressId
    ) {
      const defaultAddr =
        addresses.find((a: any) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddr._id);
      setShipping({
        name: userName || "",
        phone: defaultAddr.mobile || userMobile || "",
        address: defaultAddr.addressLine1 || "",
        city: defaultAddr.city || "",
        state: defaultAddr.state || "",
        pincode: defaultAddr.pincode || "",
      });
      setIsAddingNew(false);
    } else if (isAuthenticated() && addresses && addresses.length === 0) {
      setIsAddingNew(true);
    }
  }, [addresses, isAuthenticated, userName, userMobile, selectedAddressId]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/user/login?redirect=checkout");
    } else {
      // Pre-fill user data name
      setShipping((prev) => ({
        ...prev,
        name: userName || "",
        phone: userMobile || prev.phone,
      }));

      fetchAddressesAndSetDefault();
    }
  }, [isAuthenticated, userName, userMobile, navigate]);

  const handleAddressSelect = (addr: any) => {
    setSelectedAddressId(addr._id);
    setShipping({
      name: userName || "",
      phone: addr.mobile || userMobile || "",
      address: addr.addressLine1 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
    });
    setIsAddingNew(false);
    setEditingAddressId(null);
  };

  const handleEditAddress = (addr: any) => {
    setEditingAddressId(addr._id);
    setAddressLabel(addr.type || "Home");
    setCustomLabel(
      addr.type && !["Home", "Work"].includes(addr.type) ? addr.type : "",
    );
    setShipping({
      name: userName || "",
      phone: addr.mobile || "",
      address: addr.addressLine1 || "",
      city: addr.city || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
    });
    setIsAddingNew(true);
  };

  const handleDeleteAddress = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this address?")) return;

    try {
      const res = await userAPI.deleteAddress(id);
      if (res.success) {
        await syncProfile();
        if (selectedAddressId === id) {
          setSelectedAddressId(null);
        }
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shipping.phone.length !== 10) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    setIsProcessing(true);
    try {
      const label = addressLabel === "Other" ? customLabel : addressLabel;
      const addressData = {
        type: label,
        addressLine1: shipping.address,
        city: shipping.city,
        state: shipping.state,
        pincode: shipping.pincode,
        mobile: shipping.phone,
        isDefault: !editingAddressId && addresses.length === 0,
      };

      let res: any;
      if (editingAddressId) {
        res = await userAPI.updateAddress(editingAddressId, addressData);
      } else {
        res = await userAPI.addAddress(addressData);
      }

      if (res.success) {
        await syncProfile();

        // Use the callback-less sync or just assume the next render will have updated addresses
        // But addresses from useUserStore might not be updated immediately in this scope
        // So we might need to find the new one in the freshly synced store
        // However, syncProfile is async and updates the store state.

        setIsAddingNew(false);
        setEditingAddressId(null);

        // Optional: Re-fetch or rely on store update
      } else {
        alert(res.message || "Failed to save address");
      }
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handleCreateOrderAndPay = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 1. Create Order in Backend & Get Payment Session
      const orderData = {
        items: selectedItems.map((item) => ({
          productId: item.productId,
          productName: getProduct(item.productId)?.name,
          productImage: getProduct(item.productId)?.image,
          quantity: item.quantity,
          price: item.price,
          weight: item.weight,
        })),
        orderAmount: subtotal,
        discount,
        deliveryCharge: deliveryCharge,
        taxAmount: taxAmount,
        finalAmount: total,
        shippingAddress: {
          addressLine1: shipping.address,
          city: shipping.city,
          state: shipping.state,
          pincode: shipping.pincode,
          mobile: shipping.phone,
        },
      };
      const response = await orderAPI.createOrder(orderData);

      if (response.success && response.data?.success) {
        const { payment_session_id, order_id } = response.data.data;

        // Save order data for verification after redirect
        localStorage.setItem(
          "lepondy_pending_order",
          JSON.stringify(orderData),
        );

        // 2. Initialize Cashfree SDK
        if (typeof window.Cashfree === "undefined") {
          console.error(
            "❌ Cashfree SDK not loaded! Check index.html script tag.",
          );
          alert(
            "Payment system is currently unavailable. Please refresh the page.",
          );
          setIsProcessing(false);
          return;
        }

        const cashfree = new window.Cashfree({
          mode:
            import.meta.env.VITE_CASHFREE_ENV === "PROD"
              ? "production"
              : "sandbox",
        });

        console.log(
          "🚀 Initiating Cashfree checkout with session:",
          payment_session_id,
        );

        // 3. Trigger Checkout Component
        await cashfree.checkout({
          paymentSessionId: payment_session_id,
          redirectTarget: "_self",
        });
      } else {
        console.error("❌ Session creation failed:", response);
        const errorMsg =
          (response.data as any)?.message ||
          response.message ||
          "Failed to initiate payment session";
        alert(errorMsg);
      }
    } catch (error: any) {
      console.error("Payment Process Error:", error);
      alert("Something went wrong with the payment process.");
    } finally {
      setIsProcessing(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const geoResp = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );
          const geoData = await geoResp.json();
          const locationName = `${geoData.city || geoData.locality || "Unknown City"}, ${geoData.principalSubdivision || ""}`;
          setGpsCoords(`${locationName} (${latitude}, ${longitude})`);

          setShipping((prev) => ({
            ...prev,
            city: geoData.city || prev.city,
            state: geoData.principalSubdivision || prev.state,
            pincode: geoData.postcode || prev.pincode,
          }));
        } catch {
          setGpsCoords(`${latitude}, ${longitude}`);
        }
        setIsLocating(false);
      },
      () => {
        alert("Unable to retrieve your location");
        setIsLocating(false);
      },
    );
  };

  if (
    selectedItems.length === 0 &&
    step !== "confirmation" &&
    !searchParams.get("order_id")
  ) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {["shipping", "payment", "confirmation"].map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step === s
                      ? "bg-[#2C5530] text-white"
                      : ["shipping", "payment", "confirmation"].indexOf(step) >
                          i
                        ? "bg-[#FAB519] text-[#1D161A]"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 h-1 ${
                      ["shipping", "payment", "confirmation"].indexOf(step) > i
                        ? "bg-[#FAB519]"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === "shipping" && (
              <div className="space-y-6">
                {/* Address Selection Section */}
                {/* Address Selection Section */}
                {!isAddingNew && (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">
                          Select Delivery Address
                        </h2>
                        <p className="text-sm text-gray-500">
                          Choose where you'd like your order delivered
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses && addresses.length > 0 ? (
                        addresses.map((addr: any) => (
                          <div
                            key={addr._id}
                            onClick={() => handleAddressSelect(addr)}
                            className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer group ${
                              selectedAddressId === addr._id
                                ? "border-[#FAB519] bg-[#FAB519]/5 shadow-md"
                                : "border-gray-100 hover:border-gray-200 bg-white"
                            }`}
                          >
                            <div className="absolute top-4 right-4 flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditAddress(addr);
                                }}
                                className="p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-[#FAB519] hover:scale-110 transition-all border border-gray-100"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) =>
                                  handleDeleteAddress(e, addr._id)
                                }
                                className="p-1.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:scale-110 transition-all border border-gray-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              {selectedAddressId === addr._id && (
                                <div className="bg-[#FAB519] text-[#1D161A] p-1 rounded-full shadow-sm">
                                  <Check className="w-4 h-4" />
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                              <div
                                className={`p-2 rounded-lg ${selectedAddressId === addr._id ? "bg-[#FAB519] text-[#1D161A]" : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"}`}
                              >
                                {(addr.type || "").toLowerCase() === "home" ? (
                                  <Home className="w-4 h-4" />
                                ) : (addr.type || "").toLowerCase() ===
                                  "work" ? (
                                  <Briefcase className="w-4 h-4" />
                                ) : (
                                  <MapPin className="w-4 h-4" />
                                )}
                              </div>
                              <span className="font-bold text-[10px] uppercase tracking-wider text-gray-400">
                                {addr.type || "Home"}
                              </span>
                            </div>

                            <div className="space-y-1">
                              <p className="font-bold text-[#1A1A1A]">
                                {userName}
                              </p>
                              <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 pr-12">
                                {addr.addressLine1}
                              </p>
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">
                                {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                              <p className="text-sm font-black text-[#2C5530] mt-3 flex items-center gap-2">
                                <Phone className="w-3 h-3" />
                                {addr.mobile || userMobile}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="md:col-span-2 text-center py-12 bg-[#FAF7F2] rounded-2xl border border-dashed border-gray-200">
                          <p className="text-gray-400 font-medium mb-4">
                            No addresses saved yet.
                          </p>
                          <button
                            onClick={() => setIsAddingNew(true)}
                            className="inline-flex items-center gap-2 bg-white text-[#2C5530] px-6 py-3 rounded-xl font-bold shadow-sm hover:shadow-md transition-all border border-gray-100"
                          >
                            <Plus className="w-5 h-5" />
                            Add Your First Address
                          </button>
                        </div>
                      )}

                      {/* Add New Address Card (Ghost) */}
                      {addresses && addresses.length > 0 && (
                        <div
                          onClick={() => {
                            setEditingAddressId(null);
                            setShipping({
                              name: userName || "",
                              phone: userMobile || "",
                              address: "",
                              city: "",
                              state: "",
                              pincode: "",
                            });
                            setIsAddingNew(true);
                          }}
                          className="p-6 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 text-gray-400 hover:border-[#FAB519] hover:text-[#FAB519] hover:bg-[#FAB519]/5 transition-all cursor-pointer min-h-[180px]"
                        >
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                            <Plus className="w-6 h-6" />
                          </div>
                          <span className="font-bold text-sm">
                            Add New Address
                          </span>
                        </div>
                      )}
                    </div>

                    {addresses && addresses.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-gray-50">
                        <button
                          onClick={() => {
                            if (!selectedAddressId) {
                              alert("Please select a delivery address.");
                              return;
                            }
                            setStep("payment");
                          }}
                          className="w-full btn btn-primary py-4 text-lg flex items-center justify-center gap-2 group"
                        >
                          Proceed to Payment
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Add/Edit Address Form Section */}
                {isAddingNew && (
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold text-[#1A1A1A] mb-1">
                          {editingAddressId
                            ? "Edit Delivery Address"
                            : "Add Delivery Address"}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {editingAddressId
                            ? "Modify your shipping details"
                            : "Enter your shipping details below"}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsAddingNew(false);
                          setEditingAddressId(null);
                        }}
                        className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddNewAddress} className="space-y-6">
                      {/* Address Type Selector */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Address Type
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { id: "Home", icon: Home },
                            { id: "Work", icon: Briefcase },
                            { id: "Other", icon: MapPin },
                          ].map((type) => (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => setAddressLabel(type.id)}
                              className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-bold transition-all ${
                                addressLabel === type.id
                                  ? "border-[#2C5530] bg-[#2C5530] text-white shadow-lg shadow-green-900/10"
                                  : "border-gray-100 bg-[#FAF7F2] text-gray-500 hover:border-gray-200"
                              }`}
                            >
                              <type.icon className="w-4 h-4" />
                              {type.id}
                            </button>
                          ))}
                        </div>

                        {addressLabel === "Other" && (
                          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                            <input
                              type="text"
                              placeholder="e.g., Friend's Place, Gym"
                              value={customLabel}
                              onChange={(e) => setCustomLabel(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FAB519] outline-none"
                              required
                            />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={shipping.name}
                            onChange={(e) =>
                              setShipping({ ...shipping, name: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FAB519] outline-none transition-all"
                            placeholder="Recipient's Name"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                              +91
                            </span>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              value={shipping.phone}
                              onChange={(e) =>
                                setShipping({
                                  ...shipping,
                                  phone: e.target.value.replace(/\D/g, ""),
                                })
                              }
                              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FAB519] outline-none transition-all"
                              placeholder="9876543210"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">
                              Auto-fill Location
                            </label>
                            <button
                              type="button"
                              onClick={detectLocation}
                              disabled={isLocating}
                              className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${isLocating ? "text-gray-300" : "text-[#FAB519] hover:text-[#2C5530]"}`}
                            >
                              <Navigation
                                className={`w-3 h-3 ${isLocating ? "animate-pulse" : ""}`}
                              />
                              {isLocating ? "Detecting..." : "Use GPS"}
                            </button>
                          </div>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            Full Address *
                          </label>
                          <textarea
                            required
                            rows={3}
                            value={shipping.address}
                            onChange={(e) =>
                              setShipping({
                                ...shipping,
                                address: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FAB519] outline-none transition-all"
                            placeholder="Flat/House No., Building, Apartment, Street"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={shipping.city}
                            onChange={(e) =>
                              setShipping({ ...shipping, city: e.target.value })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FAB519] outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            State *
                          </label>
                          <input
                            type="text"
                            required
                            value={shipping.state}
                            onChange={(e) =>
                              setShipping({
                                ...shipping,
                                state: e.target.value,
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FAB519] outline-none"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={shipping.pincode}
                            onChange={(e) =>
                              setShipping({
                                ...shipping,
                                pincode: e.target.value.replace(/\D/g, ""),
                              })
                            }
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FAB519] outline-none"
                            placeholder="605001"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <button
                          type="submit"
                          disabled={isProcessing}
                          className="w-full btn btn-primary py-4 text-lg shadow-xl shadow-green-900/10"
                        >
                          {isProcessing
                            ? "Saving..."
                            : editingAddressId
                              ? "Update & Use Address"
                              : "Save & Use this Address"}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingNew(false);
                            setEditingAddressId(null);
                          }}
                          className="w-full py-2 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          Cancel and Go Back
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Payment */}
            {step === "payment" && (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2
                  className="text-2xl font-bold mb-6 text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Secure Payment
                </h2>

                <div className="mb-8 p-6 bg-[#FAF7F2] rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                        Deliver to
                      </p>
                      <p className="font-bold text-[#1A1A1A]">
                        {shipping.name}
                      </p>
                      <p className="text-sm text-[#6B6B6B] leading-relaxed">
                        {shipping.address}
                        <br />
                        {shipping.city}, {shipping.state} - {shipping.pincode}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep("shipping")}
                      className="text-[#2C5530] text-sm font-bold hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-700">
                      Cashfree Secure Checkout Enabled
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border-2 border-[#FAB519] bg-[#FAB519]/5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center p-2">
                        <img
                          src="https://www.cashfree.com/wp-content/uploads/2022/10/logo.png"
                          alt="Cashfree"
                          className="max-h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-[#1A1A1A]">
                          Payment Gateway
                        </p>
                        <p className="text-xs text-[#6B6B6B]">
                          UPI, Cards, Netbanking, Wallets
                        </p>
                      </div>
                    </div>
                    <span className="w-6 h-6 rounded-full border-4 border-[#FAB519] bg-[#FAB519]" />
                  </div>

                  <button
                    onClick={handleCreateOrderAndPay}
                    disabled={isProcessing}
                    className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${isProcessing ? "bg-gray-200 text-gray-400" : "bg-[#2C5530] text-white hover:bg-[#1f3d22] shadow-lg shadow-green-900/10"}`}
                  >
                    {isProcessing
                      ? "Processing..."
                      : `Pay ₹${total.toLocaleString()}`}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === "confirmation" && (
              <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce-slow">
                  <svg
                    className="w-12 h-12 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h1
                  className="text-4xl font-black mb-4 text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Deliciously Done!
                </h1>
                <p className="text-lg text-[#6B6B6B] mb-8">
                  Thank you, {userName}. Your order{" "}
                  <strong>{orderResult?.orderId}</strong> is confirmed.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
                  <div className="bg-[#FAF7F2] p-6 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Notification Sent to
                    </p>
                    <p className="font-bold text-[#2C5530]">{userEmail}</p>
                  </div>
                  <div className="bg-[#FAF7F2] p-6 rounded-2xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Shipping Target
                    </p>
                    <p className="font-bold text-[#FAB519]">
                      {shipping.city}, {shipping.state}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Link to="/user" className="btn btn-primary px-8">
                    View My Orders
                  </Link>
                  <Link to="/shop" className="btn btn-secondary px-8">
                    Keep Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {step !== "confirmation" && (
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h3
                  className="font-bold text-lg mb-6 text-[#1A1A1A]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Your Basket
                </h3>

                <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar space-y-4 mb-6">
                  {selectedItems.map((item, i) => {
                    const product = getProduct(item.productId);
                    if (!product) return null;
                    return (
                      <div key={i} className="flex gap-4">
                        <div className="w-16 h-16 bg-[#FAF7F2] rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-sm text-[#1A1A1A] line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-[10px] font-bold text-[#6B6B6B]">
                            {item.weight} × {item.quantity}
                          </p>
                          <p className="text-sm font-black text-[#2C5530]">
                            ₹{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-gray-100 pt-6 space-y-3">
                  <div className="flex justify-between text-sm text-[#6B6B6B]">
                    <span>Subtotal</span>
                    <span className="font-bold text-[#1A1A1A]">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6B6B6B] items-center">
                    <div className="flex items-center gap-1.5">
                      <span>Delivery</span>
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
                              We are packing your order with specialized
                              packaging and trying to deliver you without 0%
                              quality loss.
                              <div className="absolute -bottom-4 left-1 w-2 h-2 bg-gray-900 rotate-45" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="font-bold text-[#1A1A1A]">
                      ₹{deliveryCharge.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-[#6B6B6B]">
                    <span>Tax and Charges</span>
                    <span className="font-bold text-[#1A1A1A]">
                      ₹{taxAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-xl pt-4 border-t border-gray-100 text-[#1A1A1A]">
                    <span>Total</span>
                    <span className="text-[#2C5530]">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
