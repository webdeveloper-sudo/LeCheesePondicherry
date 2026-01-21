"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import {
  LogOut,
  Heart,
  Star,
  ShoppingBag,
  Settings,
  MapPin,
} from "lucide-react";
import Image from "next/image";

export default function YourPicks() {
  const { uid, name, email, photoURL, clearUser } = useUserStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (!uid) {
      router.push("/user/login");
      return;
    }

    const fetchData = async () => {
      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uid, router]);

  const handleLogout = async () => {
    await auth.signOut();
    clearUser();
    router.push("/user/login");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2C5530]"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#F5E6D3]">
            <Image
              src={photoURL || "/images/default-avatar.png"} // Ensure you have a default avatar or handle this
              alt={name}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback if image fails
                // (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
              }}
            />
            {/* Fallback primitive if no image */}
            {!photoURL && (
              <div className="w-full h-full bg-[#2C5530] text-white flex items-center justify-center text-3xl font-bold">
                {name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-[#1A1A1A] font-heading">
              {name}
            </h1>
            <p className="text-gray-500">{email}</p>
            <p className="text-sm text-[#C9A961] mt-1 flex items-center justify-center md:justify-start gap-1">
              <MapPin size={14} />{" "}
              {userData?.address ? "Address Saved" : "No Address Saved"}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <Settings size={16} /> Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Picks / Preferences */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-50 rounded-lg text-[#C9A961]">
                <Star size={20} />
              </div>
              <h3 className="font-bold text-lg">Your Top Picks</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Based on your cheese preferences.
            </p>
            {/* Placeholder for reusable component */}
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">No recommendations yet.</p>
              <button className="text-[#2C5530] text-sm font-semibold mt-2 hover:underline">
                Update Preferences
              </button>
            </div>
          </div>

          {/* Wishlist / Favorites */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg text-red-500">
                <Heart size={20} />
              </div>
              <h3 className="font-bold text-lg">Favorites</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Items you have saved for later.
            </p>
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">Your wishlist is empty.</p>
              <button
                onClick={() => router.push("/shop")}
                className="text-[#2C5530] text-sm font-semibold mt-2 hover:underline"
              >
                Browse Shop
              </button>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg text-[#2C5530]">
                <ShoppingBag size={20} />
              </div>
              <h3 className="font-bold text-lg">Orders</h3>
            </div>
            <p className="text-gray-500 text-sm mb-4">
              Track and view past orders.
            </p>
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">No orders placed yet.</p>
            </div>
          </div>
        </div>

        {/* Preferences Section (Expandable) */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-lg mb-4">Taste Preferences</h3>
          <div className="flex flex-wrap gap-2">
            {userData?.preferences?.map((pref: string) => (
              <span
                key={pref}
                className="px-3 py-1 bg-[#F5E6D3] text-[#2C5530] text-sm rounded-full"
              >
                {pref}
              </span>
            )) || (
              <span className="text-gray-400 text-sm">
                No preferences selected.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
