"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { LogOut, Settings, MapPin, Star, ShoppingBag } from "lucide-react";
import { orderAPI } from "@/lib/api";
import YourPicks from "../../components/YourPicks";

export default function UserDashboard() {
  const { uid, name, email, photoURL, logout, syncProfile, addresses } =
    useUserStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!uid) {
        navigate("/user/login");
        return;
      }

      await syncProfile();
      setLoading(false);
    };

    init();
  }, [uid, navigate, syncProfile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/user/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF7F2]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2C5530]"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-4 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#F5E6D3] shadow-sm">
            {photoURL ? (
              <img
                src={photoURL}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#2C5530] text-white flex items-center justify-center text-3xl font-bold">
                {name?.charAt(0) || "U"}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#1A1A1A] font-heading mb-1">
              Welcome, {name}
            </h1>
            <p className="text-gray-500 mb-3">{email}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <p className="text-sm text-[#C9A961] font-medium flex items-center gap-1">
                <MapPin size={14} />{" "}
                {addresses && addresses.length > 0
                  ? `${addresses.length} Address${addresses.length > 1 ? "es" : ""} Saved`
                  : "No Address Saved"}
              </p>
              <Link
                to="/user/editprofile"
                className="text-xs font-bold text-[#2C5530] hover:underline uppercase tracking-wider"
              >
                Manage Addresses
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              to="/user/editprofile"
              className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all text-[#1A1A1A]"
            >
              <Settings size={18} /> Edit Profile
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="">
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-[#FFFFFF] rounded-xl  grid grid-cols-1 lg:grid-cols-2 gap-6 shadow-md p-6">
              <Link to="/orders" className="flex items-center justify-content-center border border-gray-300 p-6 rounded-xl gap-3">
                <div className="p-2 bg-[#F5E6D3] rounded-lg text-[#2C5530]">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] font-heading">
                  Your Orders
                </h2>
              </Link>
              <Link to="/cart" className="flex items-center justify-content-center border border-gray-300 p-6 rounded-xl gap-3">
                <div className="p-2 bg-[#F5E6D3] rounded-lg text-[#2C5530]">
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
                </div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] font-heading">
                  Your Cart
                </h2>
              </Link>
            </div>
            <YourPicks />
          </div>

          {/* <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4 font-heading">
                Recent Activity
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  No recent activity detected.
                </p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function OrderHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        if (res.success && res.data) {
          setOrders(res.data.data || []);
        }
      } catch (err) {
        console.error("Fetch orders err:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-heading text-[#1A1A1A]">
          Your Orders
        </h2>
        <Link
          to="/shop"
          className="text-sm font-bold text-[#2C5530] hover:underline"
        >
          New Purchase
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border-2 border-dashed border-gray-100 text-center">
          <p className="text-[#6B6B6B] mb-4">
            You haven't placed any orders yet.
          </p>
          <Link to="/shop" className="btn btn-primary px-8">
            Browse the Shop
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-[#C9A961] transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Order ID
                  </p>
                  <p className="font-bold text-[#1A1A1A]">{order.orderId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Date
                  </p>
                  <p className="font-bold text-[#1A1A1A]">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Total
                  </p>
                  <p className="font-bold text-[#2C5530]">
                    ₹{order.finalAmount}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.orderStatus === "confirmed"
                        ? "bg-green-100 text-green-700"
                        : order.orderStatus === "shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.orderStatus === "delivered"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {order.items.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex-shrink-0 flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-xl border border-gray-100"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-xs font-bold text-[#2C5530]">
                      {item.quantity}x
                    </div>
                    <div className="pr-2">
                      <p className="text-xs font-bold text-[#1A1A1A] line-clamp-1">
                        {item.productName}
                      </p>
                      <p className="text-[9px] text-[#6B6B6B]">{item.weight}</p>
                    </div>
                  </div>
                ))}
              </div>

              {order.trackingNumber && (
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <p className="text-xs font-medium text-gray-600">
                      Track:{" "}
                      <span className="text-[#1A1A1A] font-bold">
                        {order.trackingNumber}
                      </span>{" "}
                      via {order.courierPartner}
                    </p>
                  </div>
                  {order.estimatedDeliveryDate && (
                    <p className="text-[10px] text-gray-400">
                      Est. Arrival:{" "}
                      {new Date(
                        order.estimatedDeliveryDate,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
