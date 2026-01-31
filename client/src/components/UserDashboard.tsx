"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/useUserStore";
import { LogOut, Settings, MapPin } from "lucide-react";
import YourPicks from "./YourPicks";

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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-12 flex flex-col md:flex-row items-center gap-6">
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
        <YourPicks />
      </div>
    </div>
  );
}
