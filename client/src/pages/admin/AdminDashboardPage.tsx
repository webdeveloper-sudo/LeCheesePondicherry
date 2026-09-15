import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "@/pages/admin/AdminSidebar";
import UserManagement from "@/pages/admin/UserManagement";
import ProductManagement from "@/pages/admin/ProductManagement";
import OrderManagement from "@/pages/admin/OrderManagement";
import BlogManagement from "@/pages/admin/BlogManagement";
import SettingsManagement from "@/pages/admin/SettingsManagement";
import ReviewManagement from "@/pages/admin/ReviewManagement";
import AdminManagement from "@/pages/admin/AdminManagement";
import BannerManagement from "@/pages/admin/BannerManagement";
import { LogOut, Menu, ShieldAlert } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";

const SUPER_ADMIN_EMAIL = "vp.expansions@hopemarket.in";

export default function AdminDashboardPage() {
  const { role, email, permissions = [], isSuperAdmin: isSuperAdminStore, logout } = useUserStore();
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const isSuperAdmin = email === SUPER_ADMIN_EMAIL || isSuperAdminStore === true;

  // Initialize active tab to first permitted page
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (isSuperAdmin) return "products";
    return permissions.length > 0 ? permissions[0] : "products";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          addToast("Your admin session has expired. Please login again.", "error");
          handleLogout();
        }
      }
    } else {
      navigate("/admin");
    }
  }, [role, navigate]);

  // Enforce tab permissions: if user tries to access a tab they don't have permission for
  useEffect(() => {
    if (!isSuperAdmin) {
      if (activeTab === "admins" || (permissions.length > 0 && !permissions.includes(activeTab))) {
        const fallbackTab = permissions.length > 0 ? permissions[0] : "products";
        setActiveTab(fallbackTab);
      }
    }
  }, [activeTab, permissions, isSuperAdmin]);

  const handleLogout = async () => {
    await logout();
    navigate("/admin");
  };

  const renderContent = () => {
    // Super Admin Exclusive Tab
    if (activeTab === "admins") {
      if (!isSuperAdmin) {
        return (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
            <ShieldAlert size={48} className="text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
            <p className="text-sm text-gray-500 max-w-md mt-1">
              Admin Management is exclusively restricted to the Super Administrator ({SUPER_ADMIN_EMAIL}).
            </p>
          </div>
        );
      }
      return <AdminManagement />;
    }

    // Permission Guard for non-super admins
    if (!isSuperAdmin && permissions.length > 0 && !permissions.includes(activeTab)) {
      return (
        <div className="p-12 text-center flex flex-col items-center justify-center min-h-[60vh]">
          <ShieldAlert size={48} className="text-amber-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Page Access Restricted</h2>
          <p className="text-sm text-gray-500 max-w-md mt-1">
            You do not have permission to view the {activeTab} management section. Please contact your Super Administrator.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "orders":
        return <OrderManagement />;
      case "users":
        return <UserManagement />;
      case "products":
        return <ProductManagement />;
      case "reviews":
        return <ReviewManagement />;
      case "blogs":
        return <BlogManagement />;
      case "banners":
        return <BannerManagement />;
      case "settings":
        return <SettingsManagement />;
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
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 ml-0 min-h-screen transition-all duration-300">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-10 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
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
