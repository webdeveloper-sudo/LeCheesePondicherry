import React from "react";
import { Users, Package, ShoppingCart, LogOut, BookOpen, X, Settings, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SUPER_ADMIN_EMAIL = "vp.expansions@hopemarket.in";

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  onLogout,
  isOpen,
  setIsOpen,
}) => {
  const { email, permissions = [], isSuperAdmin: isSuperAdminStore } = useUserStore();

  const isSuperAdmin = email === SUPER_ADMIN_EMAIL || isSuperAdminStore === true;

  const baseMenuItems = [
    { id: "orders", label: "Orders", icon: <ShoppingCart size={20} /> },
    { id: "users", label: "Users", icon: <Users size={20} /> },
    { id: "products", label: "Products", icon: <Package size={20} /> },
    { id: "reviews", label: "Reviews", icon: <BookOpen size={20} /> },
    { id: "blogs", label: "Blogs", icon: <BookOpen size={20} /> },
    { id: "banners", label: "Banners & Breadcrumbs", icon: <SlidersHorizontal size={20} /> },
    { id: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  // Filter menu items: Super Admin sees all base items; Sub-admin sees only permitted items
  const permittedMenuItems = isSuperAdmin
    ? baseMenuItems
    : baseMenuItems.filter((item) => permissions.includes(item.id));

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`w-64 bg-slate-900 h-screen fixed left-0 top-0 text-white flex flex-col z-40 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-yellow-500">Le Pondy Admin</h2>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              {isSuperAdmin ? "Super Admin" : "Staff Admin"}
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 mt-4 px-3 space-y-1 overflow-y-auto">
          {/* Super Admin Exclusive Menu Item */}
          {isSuperAdmin && (
            <div className="mb-3 pb-3 border-b border-slate-800">
              <p className="px-3 text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">
                Super Admin
              </p>
              <button
                onClick={() => {
                  setActiveTab("admins");
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                  activeTab === "admins"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <ShieldCheck size={18} />
                  <span className="text-sm font-bold">Admin Management</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/30 text-amber-200 font-black uppercase">
                  Super
                </span>
              </button>
            </div>
          )}

          {/* Standard Navigation Items */}
          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Management
            </p>
            {permittedMenuItems.length > 0 ? (
              permittedMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === item.id
                      ? "bg-yellow-600 text-white font-bold shadow-sm"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-xs text-slate-400 italic text-center">
                No accessible pages assigned. Please contact the Super Admin.
              </div>
            )}
          </div>
        </nav>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="px-2 py-2 mb-2">
            <p className="text-xs font-bold text-slate-200 truncate">{email || "Administrator"}</p>
            <p className="text-[10px] text-slate-400 truncate">
              {isSuperAdmin ? "Super Administrator" : "Staff Administrator"}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
