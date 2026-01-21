"use client";

import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboardPage() {
  const { role, clearUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (role !== "admin") {
      router.push("/admin/login");
    }
  }, [role, router]);

  const handleLogout = () => {
    clearUser();
    router.push("/admin/login");
  };

  if (role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Orders</h2>
          <p className="text-gray-600">Manage customer orders here.</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Products</h2>
          <p className="text-gray-600">Add or edit cheese products.</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <p className="text-gray-600">View registered customers.</p>
        </div>
      </div>
    </div>
  );
}
