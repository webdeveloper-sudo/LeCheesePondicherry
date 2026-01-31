import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/pages/admin/AdminSidebar";
import UserManagement from "@/pages/admin/UserManagement";
import ProductManagement from "@/pages/admin/ProductManagement";
import OrderManagement from "@/pages/admin/OrderManagement";
import { LogOut } from "lucide-react";

export default function AdminDashboardPage() {
  const { role, logout } = useUserStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab,  ] = useState("products");

  useEffect(() => {
    // Check if user is admin, if not redirect
    const storage = localStorage.getItem("lepondy-user-storage");
    if (storage) {
      const parsed = JSON.parse(storage);
      const state = parsed.state;

      if (state?.role !== "admin") {
        navigate("/admin");
        return;
      }

      // 7-day session expiry check
      if (state?.loginAt) {
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const now = Date.now();
        if (now - state.loginAt > sevenDaysInMs) {
          alert("Your admin session has expired. Please login again.");
          handleLogout();
        }
      }
    } else {
      navigate("/admin");
    }
  }, [role, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrderManagement />;
      case "users":
        return <UserManagement />;
      case "products":
        return <ProductManagement />;
      default:
        return <ProductManagement />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen">
        <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-yellow-500 rounded-full" />
            <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
              {activeTab} Management
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-400 uppercase">
                Administrator
              </p>
              <p className="text-sm font-bold text-gray-700">Admin Account</p>
            </div>
            <div className="rounded-full bg-red-500">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-3 text-[#FFFF] hover:text-red-400 transition-colors"
              >
                <LogOut size={20} />
             
              </button>
            </div>
          </div>
        </header>

        <main className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
